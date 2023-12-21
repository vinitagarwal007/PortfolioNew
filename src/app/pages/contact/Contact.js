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
            <iframe
              src={process.env.map_url}
              className={styles.map}
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
            ></iframe>
            <label>---- OR -----</label>
            <div className={styles.addressBox}>
              <p style={{ fontWeight: "bold" }}>Mail Me at:</p>
              <p>{address}</p>
              <br />
              <Link href={mailUrl} target="_blank">
                {email}
              </Link>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

export default ContactForm;
