import Link from "next/link"
import { FC } from "react";

const Gnb: FC = () => {
    return (
        <header>
            <nav id="nav" className="clearFix">
                <h1 className="nav_logo">
                    <a href="index.html">
                        <img src="/images/berit_logo.png" alt="berit_logo" />
                    </a>
                </h1>
                <ul className="nav_menu">
                    <li>
                        <a href="#none">게시판</a>
                    </li>
                    <li>
                        <Link href="/board">
                            <a>주소록</a>
                        </Link>
                    </li>
                    <li>
                        <Link href="/content">
                            <a>계약관리</a>
                        </Link>
                    </li>
                    <li>
                        <a href="#none">개인설정</a>
                    </li>
                </ul>
                <ul className="nav_gnb">
                    <li>
                        <a href="#none">홍길동 님</a>
                    </li>
                    <li>
                        <a href="#none">
                            <img src="/images/login_icon.png" alt="" />
                        </a>
                    </li>
                    <li>
                        <a href="#none">
                            <img src="/images/info_icon.png" alt="" />
                        </a>
                    </li>
                </ul>
            </nav>
        </header>
    );
};
export default Gnb;
