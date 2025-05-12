import React, { useEffect, useState } from "react";
import ytblogo from "../../assets/youtube.svg";
import fblogo from "../../assets/facebook-ico.svg";

export default function Footer() {
  const [language, setLanguage] = useState("en");

  useEffect(() => {
    const storedLang =
      localStorage.getItem("i18nextLng") || localStorage.getItem("language");
    if (storedLang === "vi" || storedLang === "en") {
      setLanguage(storedLang);
    }
  }, []);

  const text = {
    about_us: language === "vi" ? "Về Chúng Tôi" : "About Us",
    introduce: language === "vi" ? "Giới thiệu" : "Introduce",
    services: language === "vi" ? "Sản phẩm & Dịch vụ" : "Products & Services",
    qa: language === "vi" ? "Hỏi & Đáp" : "Q&A",
    terms:
      language === "vi" ? "Điều khoản & Điều kiện" : "Terms and Conditions",
    follow: language === "vi" ? "Theo dõi chúng tôi" : "Follow Us",
    phone: language === "vi" ? "Điện thoại" : "Phone",
    email: language === "vi" ? "Email" : "Email",
    address: language === "vi" ? "Địa chỉ" : "Address",
    address_detail:
      language === "vi"
        ? "314 Nguyễn Hữu Thọ, Quận 7, TP. Hồ Chí Minh"
        : "314 Nguyen Huu Tho, District 7, Ho Chi Minh City",
  };

  return (
    <div>
      <div className="bg-slate-900 dark:border-t dark:border-gray-700 dark:bg-darkBackground text-lg font-bold text-slate-300 h-fit">
        <div className="px-20 py-8 lg:p-16 flex justify-between items-top flex-wrap flex-col gap-16 lg:flex-row lg:gap-8">
          <div className="space-y-4">
            <div className="flex text-5xl lg:text-2xl font-bold items-center">
              <img
                className="lg:h-14 lg:w-14 h-24 w-24 mr-4"
                style={{ filter: "invert(1)" }}
                src={
                  localStorage.getItem("systemImg") !== "null"
                    ? localStorage.getItem("systemImg")
                    : "/logo.png"
                }
                alt="Logo"
              />
              <h3 className="font-bold text-white">
                {localStorage.getItem("systemName")}
              </h3>
            </div>
            <ul className="text-4xl lg:text-xl">
              <li>
                {text.phone}: {localStorage.getItem("phoneNumber")}
              </li>
              <li>
                {text.email}: {localStorage.getItem("systemEmail")}
              </li>
              <li>
                {text.address}: {localStorage.getItem("address")}
              </li>
            </ul>
          </div>
          <div className="space-y-4">
            <p className="font-bold text-6xl lg:text-2xl">{text.about_us}</p>
            <ul className="text-4xl lg:text-xl">
              <li>{text.introduce}</li>
              <li>{text.services}</li>
              <li>{text.qa}</li>
              <li>{text.terms}</li>
            </ul>
          </div>
          <div className="space-y-4">
            <p className="font-bold text-6xl lg:text-2xl">{text.follow}</p>
            <ul>
              <li className="flex text-4xl lg:text-xl items-center">
                <img className="h-20 lg:h-10 mr-2" src={ytblogo} alt="Youtube" />
                Youtube
              </li>
              <li className="flex text-4xl lg:text-xl items-center">
                <img className="h-20 lg:h-10 mr-2" src={fblogo} alt="Facebook" />
                Facebook
              </li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}
