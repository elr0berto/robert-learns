import React from "react";
import {Pages, pageUrls} from "../page-urls";

function Footer() {
  return (
      <footer className="bd-footer py-2 mt-5 bg-light">
          <div className="container py-2">
              <div className="row">
                  <div className="col-lg-3">
                      <a className="d-inline-flex align-items-center mb-2 link-dark text-decoration-none" href="/"
                         aria-label="Robert Learns">
                          <img
                              src="/favicon-32x32.png" // Update this path to your actual file path
                              className="d-inline-block align-top"
                              alt="Robert Learns"
                          />
                          <span className="fs-5">Robert Learns</span>
                      </a>
                      <ul className="list-unstyled small text-muted mb-0">
                          <li className="mb-2">A virtual flash cards learning app</li>
                          <li className="mb-2"><a href={pageUrls[Pages.PrivacyPolicy].url()}>Privacy policy</a></li>
                          <li className="mb-2"><a href={pageUrls[Pages.TermsOfService].url()}>Terms of service</a></li>
                      </ul>
                  </div>
              </div>
          </div>
      </footer>
  );
}

export default Footer;