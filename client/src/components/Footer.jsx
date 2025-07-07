import React from "react";

function Footer() {
  return (
    <>
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
          <h6 className="footer-title">Services</h6>
          <a className="link link-hover">Branding</a>
          <a className="link link-hover">Design</a>
          <a className="link link-hover">Marketing</a>
          <a className="link link-hover">Advertisement</a>
        </nav>
        <nav>
          <h6 className="footer-title">Company</h6>
          <a className="link link-hover">About us</a>
          <a className="link link-hover">Contact</a>
          <a className="link link-hover">Jobs</a>
          <a className="link link-hover">Press kit</a>
        </nav>
        <nav>
          <h6 className="footer-title">Legal</h6>
          <a className="link link-hover">Terms of use</a>
          <a className="link link-hover">Privacy policy</a>
          <a className="link link-hover">Cookie policy</a>
        </nav>
      </footer>
      <div className="footer sm:footer-horizontal footer-center bg-white text-base-content p-4">
        <aside>
          <p>
            Copyright © {new Date().getFullYear()} - All right reserved to SnapShop
          </p>
        </aside>
      </div>
    </>
  );
}

export default Footer;
