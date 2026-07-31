"use client";
import { useState } from "react";
import styles from "./Contact.module.css";
import { profile } from "@/data/site";
import { GithubIcon, LinkedinIcon, MailIcon, MediumIcon } from "./icons";

export default function Contact() {
  const [copied, setCopied] = useState(false);

  const copyEmail = async () => {
    try {
      await navigator.clipboard.writeText(profile.email);
      setCopied(true);
      setTimeout(() => setCopied(false), 1800);
    } catch {
      window.location.href = profile.socials.mail;
    }
  };

  return (
    <section className="section" id="contact">
      <div className="wrap">
        <div className={styles.grid}>
          <div className={styles.left}>
            <p className="eyebrow">Get in touch</p>
            <h2 className="h2">
              If you&apos;re building something
              <br />
              that has to stay up.
            </h2>
            <p className="lede">
              I&apos;m happiest near the queue, the retry policy and the part
              everyone else is quietly nervous about. Whether you&apos;re hiring,
              building something together, or just want to argue about
              abstractions — I read everything and I reply.
            </p>

            <button className={styles.email} onClick={copyEmail}>
              <MailIcon />
              <span>{profile.email}</span>
              <em>{copied ? "copied" : "click to copy"}</em>
            </button>

            <div className={styles.meta}>
              <div>
                <span>Based in</span>
                <b>{profile.location}</b>
              </div>
              <div>
                <span>Open to</span>
                <b>Roles, collaborations, and problems that sound hard</b>
              </div>
            </div>

            <div className={styles.socials}>
              <a
                href={profile.socials.github}
                target="_blank"
                rel="noopener noreferrer"
              >
                <GithubIcon /> GitHub
              </a>
              <a
                href={profile.socials.linkedin}
                target="_blank"
                rel="noopener noreferrer"
              >
                <LinkedinIcon /> LinkedIn
              </a>
              <a
                href={profile.socials.medium}
                target="_blank"
                rel="noopener noreferrer"
              >
                <MediumIcon /> Medium
              </a>
            </div>
          </div>

          <form
            className={styles.form}
            action="https://form2channel.com/"
            method="POST"
            encType="multipart/form-data"
          >
            <input
              type="hidden"
              name="formto_apikey"
              value="KqrYnbGHlnq0jmEPBYpyzjgJo32gbH"
            />

            <div className={styles.field}>
              <label htmlFor="name">Name</label>
              <input id="name" name="Name" type="text" required />
            </div>

            <div className={styles.field}>
              <label htmlFor="email">Email</label>
              <input id="email" name="Email" type="email" required />
            </div>

            <div className={styles.field}>
              <label htmlFor="message">Message</label>
              <textarea id="message" name="Message" rows={5} required />
            </div>

            <button type="submit" className={styles.submit}>
              Send message
              <span aria-hidden="true">→</span>
            </button>
            <p className={styles.formNote}>
              Goes straight to my inbox. I reply to everything that isn&apos;t a
              recruiter template.
            </p>
          </form>
        </div>
      </div>
    </section>
  );
}
