import "dotenv/config";

process.env.NODE_ENV = "test";
const { app } = await import("../src/app.js");

const server = app.listen(0);
await new Promise((r) => server.once("listening", r));
const base = `http://127.0.0.1:${server.address().port}/api/v1`;

let cookie = "";
const j = (r) => r.json().catch(() => ({}));

async function req(path, options = {}) {
  const res = await fetch(`${base}${path}`, {
    ...options,
    headers: {
      "Content-Type": "application/json",
      ...(cookie ? { Cookie: cookie } : {}),
      ...(options.headers || {}),
    },
  });
  const setCookie = res.headers.get("set-cookie");
  if (setCookie) cookie = setCookie.split(";")[0];
  return { status: res.status, body: await j(res), setCookie };
}

const log = (label, r) =>
  console.log(`${label} -> ${r.status} ${JSON.stringify(r.body).slice(0, 220)}`);

// 1. Unauthenticated access
log("schools w/o auth", await req("/admin/schools"));
log("dashboard w/o auth", await req("/admin/dashboard"));
log("me w/o auth", await req("/admin/auth/me"));

// 2. Login
log("login ok", await req("/admin/auth/login", { method: "POST", body: JSON.stringify({ email: "admin@lewahub.com", password: "admin123" }) }));
log("login bad pw", await req("/admin/auth/login", { method: "POST", body: JSON.stringify({ email: "admin@lewahub.com", password: "wrongpass" }) }));
log("login bad email", await req("/admin/auth/login", { method: "POST", body: JSON.stringify({ email: "nobody@lewahub.com", password: "admin123" }) }));
log("login missing creds", await req("/admin/auth/login", { method: "POST", body: JSON.stringify({}) }));
log("login invalid email", await req("/admin/auth/login", { method: "POST", body: JSON.stringify({ email: "not-an-email", password: "admin123" }) }));

// 3. Authenticated
log("me", await req("/admin/auth/me"));
log("dashboard", await req("/admin/dashboard"));
log("schools list", await req("/admin/schools?page=1&limit=3"));
log("schools search", await req("/admin/schools?search=Government&limit=3"));
log("schools bad page", await req("/admin/schools?page=abc"));
log("schools big limit", await req("/admin/schools?limit=1000000"));

// 4. Get a school and update it
const list = await (await req("/admin/schools?limit=1")).body;
const schoolId = list.data[0]?.id;
console.log("picked school:", schoolId);
log("school detail", await req(`/admin/schools/${schoolId}`));
log("school invalid id", await req("/admin/schools/does-not-exist-123456789012"));

// Update website + coordinates (partial location update)
log("update school", await req(`/admin/schools/${schoolId}`, {
  method: "PATCH",
  body: JSON.stringify({
    website: "example-test-school.cm",
    location: { latitude: 5.9597, longitude: 10.1457 },
  }),
}));
log("update invalid website", await req(`/admin/schools/${schoolId}`, {
  method: "PATCH",
  body: JSON.stringify({ website: "ht!tp://broken url" }),
}));
log("update malformed bare", await req(`/admin/schools/${schoolId}`, {
  method: "PATCH",
  body: JSON.stringify({ website: "not a url at all" }),
}));
log("update invalid latitude", await req(`/admin/schools/${schoolId}`, {
  method: "PATCH",
  body: JSON.stringify({ location: { latitude: 95 } }),
}));
log("update invalid longitude", await req(`/admin/schools/${schoolId}`, {
  method: "PATCH",
  body: JSON.stringify({ location: { longitude: 200 } }),
}));
log("update empty website (clears)", await req(`/admin/schools/${schoolId}`, {
  method: "PATCH",
  body: JSON.stringify({ website: "" }),
}));

// Verification transitions
log("verify school", await req(`/admin/schools/${schoolId}`, {
  method: "PATCH",
  body: JSON.stringify({ verificationStatus: "VERIFIED" }),
}));
log("unverify school", await req(`/admin/schools/${schoolId}`, {
  method: "PATCH",
  body: JSON.stringify({ verificationStatus: "NEEDS_UPDATE" }),
}));

// Public API reflects the change
log("public school", await req(`/schools/${schoolId}`));

// Images
log("add image 1", await req(`/admin/schools/${schoolId}/images`, {
  method: "POST",
  body: JSON.stringify({
    url: "https://images.example.com/first.jpg",
    caption: "Campus entrance",
    isPrimary: true,
  }),
}));
log("add image 2", await req(`/admin/schools/${schoolId}/images`, {
  method: "POST",
  body: JSON.stringify({ url: "https://images.example.com/second.jpg", caption: "Library" }),
}));
log("add invalid image", await req(`/admin/schools/${schoolId}/images`, {
  method: "POST",
  body: JSON.stringify({ url: "ht!tp://bad.jpg" }),
}));
const images = (await (await req(`/admin/schools/${schoolId}`)).body).data?.images || [];
console.log("image count:", images.length);
if (images.length >= 2) {
  const second = images.find((i) => !i.isPrimary) || images[1];
  log("update image (make primary)", await req(`/admin/schools/${schoolId}/images/${second.id}`, {
    method: "PATCH",
    body: JSON.stringify({ isPrimary: true, caption: "Updated caption" }),
  }));
  log("update image (unset primary)", await req(`/admin/schools/${schoolId}/images/${second.id}`, {
    method: "PATCH",
    body: JSON.stringify({ isPrimary: false }),
  }));
}
for (const img of images) {
  log(`delete image ${img.id.slice(0, 8)} (primary=${img.isPrimary})`, await req(`/admin/schools/${schoolId}/images/${img.id}`, { method: "DELETE" }));
}
const after = await (await req(`/admin/schools/${schoolId}`)).body;
console.log("images after delete:", after.data.images.length, "primary:", after.data.images.find((i) => i.isPrimary)?.id?.slice(0, 8));

// 5. Create + delete a school
log("create school", await req("/admin/schools", {
  method: "POST",
  body: JSON.stringify({
    name: "Smoke Test School " + Date.now(),
    description: "Created by the admin smoke test.",
    levels: ["PRIMARY"],
    location: { region: "Centre", city: "Yaoundé" },
    website: "smoke-test.cm",
  }),
}));
const createdId = (await req("/admin/schools?search=Smoke Test School&limit=1")).body.data?.[0]?.id;
console.log("created school id:", createdId);
if (createdId) {
  log("delete school", await req(`/admin/schools/${createdId}`, { method: "DELETE" }));
}

// 6. Logout
log("logout", await req("/admin/auth/logout", { method: "POST" }));
log("me after logout", await req("/admin/auth/me"));

server.close();
process.exit(0);
