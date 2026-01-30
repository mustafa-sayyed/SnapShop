import React from "react";
import { Container } from ".";
import { Link } from "react-router-dom";

function Footer() {
  return (
    <Container>
      <footer className="w-full footer sm:footer-horizontal bg-white text-base-content p-10">
        <aside>
          <p className="text-3xl font-medium italic">
            Snap<span className="text-red-500">Shop</span>
          </p>
          <p className="flex flex-col">
            Wear the moment
            <br />
            Focuses on the experience and
            <span> feeling associated with wearing the clothes.</span>
          </p>
        </aside>
        <nav>
          <h6 className="footer-title">Company</h6>
          <Link to="/about" className="link link-hover">About us</Link>
          <Link to="/contact" className="link link-hover">Contact</Link>
        </nav>
        <nav>
          <h6 className="footer-title">Legal</h6>
          <Link className="link link-hover">Terms of use</Link>
          <Link className="link link-hover">Privacy policy</Link>
          <Link className="link link-hover">Cookie policy</Link>
        </nav>
      </footer>
      <div className="footer sm:footer-horizontal footer-center bg-white text-base-content p-4">
        <aside>
          <p>
            Copyright © {new Date().getFullYear()} - All right reserved to SnapShop
          </p>
        </aside>
      </div>
    </Container>
  );
}

export default Footer;
