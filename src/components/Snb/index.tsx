import { useRouter } from "next/router";
import { FC } from "react";

const Snb: FC = () => {
    const router = useRouter();

    return (
        <div id="slide_main_menu" className="clearFix">
            <h1 className="slide_logo">
                <a href="index.html">
                    <img src="images/berit_logo_w.png" alt="berit_logo" />
                </a>
            </h1>
            <div className="slide_item">
                <a href="#none" className="btn_start">
                    <span>
                        <i className="fas fa-file-signature"></i>계약 시작하기
                    </span>
                </a>
            </div>
            {router.pathname === "/board" &&
                <ul className="slide_menu">
                    <li><a href="#none"><i className="fas fa-fw fa-address-book"></i><span>개인 주소록</span></a></li>
                </ul>
            }
            {router.pathname === "/content" &&
                <ul className="slide_menu">
                    <li>
                        <a href="#none">
                            <i className="fas fa-fw fa-chart-bar"></i>
                            <span>계약현황</span>
                        </a>
                    </li>
                    <li className="mb_20">
                        <a href="#none">
                            <i className="fas fa-fw fa-folder"></i>
                            <span>계약폴더</span>
                        </a>
                    </li>
                    <li className="slide_sub_menu_box">
                        <ul className="slide_sub_menu">
                            <li>
                                <a href="#none" className="sub_text_color">
                                    - 기본폴더
                                </a>
                            </li>
                            <li>
                                <a href="#none" className="sub_text_color">
                                    - 폴더 1
                                </a>
                            </li>
                            <li>
                                <a href="#none" className="sub_text_color">
                                    - 폴더 2
                                </a>
                            </li>
                        </ul>
                    </li>
                </ul>
            }
            <hr className="check_line" />;
            <div className="slide_btn">
                <button className="sidebarToggle"></button>
            </div>
        </div>
    );
};
export default Snb;
