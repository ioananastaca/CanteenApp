import React from "react";

function Footer() {
  return (
    <div className="footer bottom bg-dark text-white py-4">
      <div className="container">
        <div className="row">
          <div className="col-lg-6">
            <h5>Contact</h5>
            <p>
              Email: <a href="mailto:cantina@usv.ro">cantina@usv.ro</a>
            </p>
            <div className="col-lg-6">
              <h5>Adresa</h5>
              <p>Str. Universității nr. 13</p>
            </div>
          </div>

          <div className="col-lg-6">
            <h5>Program</h5>
            <p>
              Luni - Vineri: 12:30 PM - 14:30 PM
              <br />
              Sâmbătă - Duminică: Închis
            </p>
          </div>
        </div>
      </div>
      <div className="text-center mt-3">
        &copy; Made with <i className="bi bi-heart-fill"></i> by Ioana
      </div>
    </div>
  );
}

export default Footer;
