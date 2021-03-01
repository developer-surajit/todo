const reg = /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i;

export default function (emails) {
  const invalidEmails = emails
    .split(" ")
    .map((email) => email.trim())
    .filter((email) => reg.test(email) === false);
  return invalidEmails;
}
