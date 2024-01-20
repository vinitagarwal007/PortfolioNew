import React, { useEffect, useState } from "react";
import styles from "./Contact.module.css";
import Link from "next/link";
function ContactForm({innerRef}) {
  const [mailUrl, setMailUrl] = useState("");
  const address =
    "KP9C, Kalinga Institute of Industrial Technology, Patia, Khorda, Bhubaneswar - 751024";
  const email = "vinitagarwal.garg@gmail.com";
  useEffect(() => {
    setMailUrl(
      window.innerWidth < 480
        ? `mailto:${email}`
        : `https://mail.google.com/mail/?view=cm&fs=1&to=${email}&su=Contacting for Enquiry&body=Hi, Vinit`
    );
  }, []);
  return (
    <>
      <div className={styles.ContactForm} ref={innerRef}>
        <label className={styles.header}>GET IN TOUCH</label>
        <label className={styles.header2}>Contact.</label>
        <div className={styles.formHolder}>
          <form
            action="https://form2channel.com/?apikey=WIxKSYTpxkkWQiuvY2Ur49cBlAOirK"
            method="POST"
            enctype="multipart/form-data"
            className={styles.form}
          >
            <label htmlFor="name">Name</label>
            <input id="text" type="name" name="name" />
            <label htmlFor="email">Email Address</label>
            <input id="email" type="email" name="email" />
            <label htmlFor="email">Message</label>
            <textarea id="message" name="message" />
            <button type="submit">
              Submit
            </button>
          </form>
          <div className={styles.mapHolder}>
            <img
              src={"https://uploads-ssl.webflow.com/65aa2aa4809a02781fc77acf/65abfe1b2194abdf88ae758f_Imagem-min.png"}
              className={styles.map}
            ></img>
          </div>
        </div>
      </div>
    </>
  );
}

export default ContactForm;
