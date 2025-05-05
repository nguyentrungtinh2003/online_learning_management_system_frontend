import React, { useEffect, useState } from "react";
import ytblogo from "../../assets/youtube.svg";
import fblogo from "../../assets/facebook-ico.svg";
import logoCode from "../../assets/logoCode.png";

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
    terms: language === "vi" ? "Điều khoản & Điều kiện" : "Terms and Conditions",
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
        <div className="p-16 flex justify-between items-top flex-wrap gap-8">
          <div className="space-y-4">
            <div className="flex text-2xl font-bold items-center">
              <img
                className="h-14 mr-4"
                style={{ filter: "invert(1)" }}
                src={logoCode}
                alt="Logo"
              />
              <h3 className="text-xl font-bold text-white">Code Arena</h3>
            </div>
            <ul>
              <li>{text.phone}: 0334023469</li>
              <li>{text.email}: contact@codearena.edu.com</li>
              <li>{text.address}: {text.address_detail}</li>
            </ul>
          </div>
          <div className="space-y-4">
            <p className="font-bold text-2xl">{text.about_us}</p>
            <ul>
              <li>{text.introduce}</li>
              <li>{text.services}</li>
              <li>{text.qa}</li>
              <li>{text.terms}</li>
            </ul>
          </div>
          <div className="space-y-4 mx-10">
            <p className="font-bold text-2xl">{text.follow}</p>
            <ul>
              <li className="flex items-center">
                <img className="h-10 mr-2" src={ytblogo} alt="Youtube" />
                Youtube
              </li>
              <li className="flex items-center">
                <img className="h-10 mr-2" src={fblogo} alt="Facebook" />
                Facebook
              </li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}
