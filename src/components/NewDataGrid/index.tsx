import { Page } from "@utils";
import dayjs from "dayjs";
import { FC, useEffect } from "react";
import { useForm } from "react-hook-form"

interface Content {
    contentNo: number;
    contentName: string;
    lastModifiedBy: string;
    modifiedDate: string;
}

interface Props {
    data: Page
    onDeleted?: (contentNos: string[]) => void;
}

interface IForm {
    contentNos: string[];
}

const NewDataGrid: FC<Props> = ({ data, onDeleted }) => {
    const {
        register,
        handleSubmit,
        setValue,
        watch,
        formState: { errors },
    } = useForm<IForm>({
        mode: "onChange",
        defaultValues: {
            contentNos: [],
        },
    });

    const handleDelete = () => {
        const contentNos = watch("contentNos");
        if (contentNos.length === 0) {
            alert("항목을 선택해 주세요.")
            return;
        }
        onDeleted && onDeleted(contentNos);
    }

    // useEffect(() => {
    //     console.log(watch("contentNos"))
    // }, [watch("contentNos")])

    return (
        <>
            <p className="search_result_text">
                <i className="fas fa-genderless fa-lg main_color"></i>
                검색 결과 총<span className="main_color">{data.totalElements}건</span>의 계약 건이
                조회되었습니다.
            </p>
            <div className="table_control_btn_grop clearFix">
                <ul className="control_btn_l">
                    <li>
                        <a href="#none" className="auto_btn danger_btn" onClick={handleDelete}>
                            삭제
                        </a>
                    </li>
                    <li>
                        <a href="#none" className="auto_btn agree_btn">
                            폴더이동
                        </a>
                    </li>
                </ul>
                <ul className="control_btn_r">
                    <li>
                        <a href="#none" className="auto_btn third_btn">
                            액셀저장
                        </a>
                    </li>
                    <li>
                        <a href="#none" className="auto_btn secondary_btn">
                            계약문서 다운로드
                        </a>
                    </li>
                    <li>
                        <a href="#none" className="auto_btn primary_btn">
                            알림 재전송
                        </a>
                    </li>
                    <li>
                        <a href="#none" className="auto_btn cancel_btn">
                            계약취소
                        </a>
                    </li>
                    <li>
                        <a href="#none" className="auto_btn delete_btn">
                            승인
                        </a>
                    </li>
                </ul>
            </div>
            <div className="table_box">
                <table className="table_blue_top">
                    <caption></caption>
                    <colgroup>
                        <col style={{ width: "2%" }} />
                        <col style={{ width: "8%" }} />
                        <col style={{ width: "9%" }} />
                        <col style={{ width: "0%" }} />
                        <col style={{ width: "5%" }} />
                        <col style={{ width: "8%" }} />
                        <col style={{ width: "14%" }} />
                        <col style={{ width: "14%" }} />
                        <col style={{ width: "10%" }} />
                    </colgroup>
                    <tbody>
                        <tr>
                            <th>
                                <input type="checkbox" className="table_checkbox" />
                            </th>
                            <th>진행상태</th>
                            <th>계약참여자</th>
                            <th>문서명</th>
                            <th>폴더</th>
                            <th>계약만료</th>
                            <th>발송일시</th>
                            <th>완료일시</th>
                            <th></th>
                        </tr>
                        {data.content.map((item: Content) =>
                            <tr key={item.contentNo}>
                                <td>
                                    <input {...register("contentNos")} type="checkbox" className="table_checkbox" defaultValue={item.contentNo} />
                                </td>
                                <td>{item.contentName}</td>
                                <td>{item.lastModifiedBy}</td>
                                <td>문서의 제목</td>
                                <td>폴더</td>
                                <td>계약만료</td>
                                <td>{dayjs(item.modifiedDate).format("YYYY-MM-DD HH:mm:ss")}</td>
                                <td>2023-06-01 17:00</td>
                                <td>
                                    <a href="#none" className="auto_btn border_btn">
                                        진행정보
                                    </a>
                                </td>
                            </tr>
                        )}

                    </tbody>
                </table>
                <div className="page_wrap">
                    <ul className="page_nation clearFix">
                        <li>
                            <a href="#none" className="active">
                                1
                            </a>
                        </li>
                        <li>
                            <a href="#none">2</a>
                        </li>
                        <li>
                            <a href="#none">3</a>
                        </li>
                    </ul>
                </div>
            </div>
        </>
    );
};

export default NewDataGrid;
