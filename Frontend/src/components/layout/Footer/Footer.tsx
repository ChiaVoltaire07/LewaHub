import { Link } from "react-router-dom";
import { useTranslation } from "react-i18next";

export default function Footer() {
  const { t } = useTranslation();

  return (
    <footer
      style={{
        backgroundColor: "var(--ink, #14231C)",
        color: "#FFFFFF",
        padding: "60px 24px 24px",
        marginTop: "60px",
      }}
    >
      <div style={{ maxWidth: "1400px", margin: "0 auto" }}>
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "1fr",
            gap: "40px",
            marginBottom: "40px",
          }}
          className="md:grid-cols-2 lg:grid-cols-[2fr_1fr]"
        >
          {/* Brand */}
          <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
            <h3
              style={{
                fontFamily: "Fraunces, serif",
                fontSize: "24px",
                fontWeight: 700,
                color: "var(--forest, #1F5D45)",
                margin: 0,
              }}
            >
              LewaHub
            </h3>
            <p
              style={{
                fontSize: "14px",
                color: "#FFFFFF",
                opacity: 0.7,
                lineHeight: 1.6,
                margin: 0,
                maxWidth: "300px",
              }}
            >
              Connecting students with the best educational institutions in Cameroon
            </p>
          </div>

          {/* Links */}
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(2, 1fr)",
              gap: "40px",
            }}
          >
            <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
              <h4
                style={{
                  fontSize: "16px",
                  fontWeight: 600,
                  color: "#FFFFFF",
                  margin: "0 0 4px 0",
                }}
              >
                {t("nav.home")}
              </h4>
              <Link
                to="/"
                style={{
                  color: "#FFFFFF",
                  opacity: 0.7,
                  textDecoration: "none",
                  fontSize: "14px",
                  transition: "all 0.3s ease",
                }}
                className="hover:opacity-100"
                onMouseEnter={(e) => (e.currentTarget.style.color = "var(--sunbeam, #E8A93B)")}
                onMouseLeave={(e) => (e.currentTarget.style.color = "#FFFFFF")}
              >
                {t("nav.home")}
              </Link>
              <Link
                to="/search"
                style={{
                  color: "#FFFFFF",
                  opacity: 0.7,
                  textDecoration: "none",
                  fontSize: "14px",
                  transition: "all 0.3s ease",
                }}
                className="hover:opacity-100"
                onMouseEnter={(e) => (e.currentTarget.style.color = "var(--sunbeam, #E8A93B)")}
                onMouseLeave={(e) => (e.currentTarget.style.color = "#FFFFFF")}
              >
                {t("nav.search")}
              </Link>
              <Link
                to="/about"
                style={{
                  color: "#FFFFFF",
                  opacity: 0.7,
                  textDecoration: "none",
                  fontSize: "14px",
                  transition: "all 0.3s ease",
                }}
                className="hover:opacity-100"
                onMouseEnter={(e) => (e.currentTarget.style.color = "var(--sunbeam, #E8A93B)")}
                onMouseLeave={(e) => (e.currentTarget.style.color = "#FFFFFF")}
              >
                {t("nav.about")}
              </Link>
              <Link
                to="/contact"
                style={{
                  color: "#FFFFFF",
                  opacity: 0.7,
                  textDecoration: "none",
                  fontSize: "14px",
                  transition: "all 0.3s ease",
                }}
                className="hover:opacity-100"
                onMouseEnter={(e) => (e.currentTarget.style.color = "var(--sunbeam, #E8A93B)")}
                onMouseLeave={(e) => (e.currentTarget.style.color = "#FFFFFF")}
              >
                {t("nav.contact")}
              </Link>
            </div>

            <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
              <h4
                style={{
                  fontSize: "16px",
                  fontWeight: 600,
                  color: "#FFFFFF",
                  margin: "0 0 4px 0",
                }}
              >
                {t("contact.info.title")}
              </h4>
              <p
                style={{
                  fontSize: "14px",
                  color: "#FFFFFF",
                  opacity: 0.7,
                  margin: 0,
                }}
              >
                info@lewahub.com
              </p>
              <p
                style={{
                  fontSize: "14px",
                  color: "#FFFFFF",
                  opacity: 0.7,
                  margin: 0,
                }}
              >
                Yaoundé, Cameroon
              </p>
            </div>
          </div>
        </div>

        {/* Bottom bar */}
        <div
          style={{
            paddingTop: "24px",
            borderTop: "1px solid rgba(255, 255, 255, 0.1)",
            textAlign: "center",
          }}
        >
          <p style={{ fontSize: "13px", color: "#FFFFFF", opacity: 0.5, margin: 0 }}>
            &copy; {new Date().getFullYear()} LewaHub. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
}