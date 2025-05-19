import React from "react";
import { useTranslation } from "react-i18next";
import ytblogo from "../../assets/youtube.svg";
import fblogo from "../../assets/facebook-ico.svg";

export default function Footer() {
  const { t } = useTranslation("homepage");

  return (
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
            <h3 className="font-bold text-fcolor">
              {localStorage.getItem("systemName")}
            </h3>
          </div>
          <ul className="text-4xl lg:text-xl">
            <li>{t("footer.phone")}: {localStorage.getItem("phoneNumber")}</li>
            <li>{t("footer.email")}: {localStorage.getItem("systemEmail")}</li>
            <li>{t("footer.address")}: {localStorage.getItem("address")}</li>
          </ul>
        </div>
        <div className="space-y-4">
          <p className="font-bold text-6xl lg:text-2xl">{t("footer.about_us")}</p>
          <ul className="text-4xl lg:text-xl">
            <li>{t("footer.introduce")}</li>
            <li>{t("footer.services")}</li>
            <li>{t("footer.qa")}</li>
            <li>{t("footer.terms")}</li>
          </ul>
        </div>
        <div className="space-y-4">
          <p className="font-bold text-6xl lg:text-2xl">{t("footer.follow")}</p>
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
  );
}
