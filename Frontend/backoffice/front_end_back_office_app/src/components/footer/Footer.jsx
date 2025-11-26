const Footer = () => {
  return (
    <div className="flex w-full flex-col items-center justify-between px-1 pb-8 pt-3 lg:px-8 xl:flex-row">
      <p className="mb-4 text-center text-sm text-gray-600 sm:!mb-0 md:text-base">
        © {new Date().getFullYear()} KIDORA Back Office. All Rights Reserved.
      </p>

      <ul className="flex flex-wrap items-center gap-3 sm:flex-nowrap md:gap-10">
        <li>
          <a
            href="#"
            className="text-base font-medium text-gray-600 hover:text-gray-800"
            target="_blank"
            rel="noopener noreferrer"
          >
            Privacy Policy
          </a>
        </li>

        <li>
          <a
            href="#"
            className="text-base font-medium text-gray-600 hover:text-gray-800"
            target="_blank"
            rel="noopener noreferrer"
          >
            Terms of Service
          </a>
        </li>

        <li>
          <a
            href="#"
            className="text-base font-medium text-gray-600 hover:text-gray-800"
            target="_blank"
            rel="noopener noreferrer"
          >
            Support
          </a>
        </li>

        <li>
          <a
            href="#"
            className="text-base font-medium text-gray-600 hover:text-gray-800"
            target="_blank"
            rel="noopener noreferrer"
          >
            Contact
          </a>
        </li>
      </ul>
    </div>
  );
};

export default Footer;
