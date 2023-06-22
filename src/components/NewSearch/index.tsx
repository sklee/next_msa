import { TextField } from "@material-ui/core";
import { conditionAtom, conditionSelector, conditionValue } from "@stores";
import { FC, createRef, useEffect, useState } from "react";
import { FieldErrors, useForm } from "react-hook-form";
import { useRecoilValue, useSetRecoilState } from "recoil";
import dayjs from "dayjs"

interface IForm {
    keyword?: string;
    fromDate?: string;
    endDate?: string;
}

// 조회조건 select 아이템 타입
export interface IKeywordType {
    key: string;
    label: string;
}

// 조회조건 컴포넌트 props
export interface ISearchProp {
    keywordTypeItems: IKeywordType[]; // 조회조건 select items
    handleRegister?: () => void; // 등록 시
    conditionKey: string; // 조회조건 상태값을 관리할 키 값 (e.g. 이용약관관리 -> policy)
    isNotWrapper?: boolean;
    customKeyword?: conditionValue;
    conditionNodes?: React.ReactNode;
}

const NewSearch: FC<ISearchProp> = ({
    keywordTypeItems,
    handleRegister,
    conditionKey,
    customKeyword,
    isNotWrapper,
    conditionNodes,
}) => {
    const {
        register,
        handleSubmit,
        setValue,
        watch,
        formState: { errors },
    } = useForm<IForm>({
        mode: "onChange",
        defaultValues: {
            keyword: "",
            fromDate: dayjs().format("YYYY-MM-DD"),
            endDate: dayjs().format("YYYY-MM-DD"),
        },
    });

    // // 조회조건에 대한 키(conditionKey)로 각 기능에서 조회조건 상태값을 관리한다.
    const setRecoilValue = useSetRecoilState(conditionSelector(conditionKey))
    const conditionState = useRecoilValue(conditionAtom(conditionKey))
    const [keywordTypeState, setKeywordTypeState] = useState<string>('')

    // 조회 시 조회조건 상태값 저장 후 부모컴포넌트의 조회 함수를 call한다.
    const search = ({ keyword, fromDate, endDate }: IForm) => {
        setRecoilValue({
            ...conditionState,
            keywordType: keywordTypeState,
            keyword,
            fromDate,
            endDate,
            ...customKeyword,
        })
    }

    const handleRangeDate = (month: number) =>
        setValue(
            "fromDate",
            dayjs().subtract(month, "month").format("YYYY-MM-DD")
        );

    const onSubmit = (formData: IForm) => search(formData)
    const onInvalid = (errors: FieldErrors) => {
        console.log(errors)
    }

    // // 등록 버튼 클릭
    // const onClickAdd = (event: React.MouseEvent<HTMLButtonElement>) => {
    //     event.preventDefault()
    //     handleRegister()
    // }

    return (
        <form className="table_box table_box_left table_box_mb_20" onSubmit={handleSubmit(onSubmit, onInvalid)}>
            <table className="table_blue_top">
                <caption></caption>
                <colgroup>
                    <col style={{ width: "10%" }} />
                    <col style={{ width: "90%" }} />
                </colgroup>
                <tbody>
                    <tr>
                        <th>검색구분</th>
                        <td className="search_box clearFix">
                            <div className="input_group mr_10">
                                <input
                                    {...register("fromDate")}
                                    type="date"
                                    className="form_control"
                                />
                                <img src="images/calendar.gif" alt="켈린더" />
                                <span> ~ </span>
                                <input
                                    {...register("endDate")}
                                    type="date"
                                    className="form_control"
                                />
                                <img src="images/calendar.gif" alt="켈린더" />
                            </div>
                            <div className="select_group">
                                <label className="btn date_btn" onClick={() => handleRangeDate(1)}>
                                    <input type="radio" name="recentMonth" id="jb-radio-1" />
                                    최근 1개월
                                </label>
                                <label className="btn date_btn" onClick={() => handleRangeDate(3)}>
                                    <input type="radio" name="recentMonth" id="jb-radio-2" />
                                    최근 3개월
                                </label>
                                <label className="btn date_btn" onClick={() => handleRangeDate(6)}>
                                    <input type="radio" name="recentMonth" id="jb-radio-3" />
                                    최근 6개월
                                </label>
                            </div>
                        </td>
                    </tr>
                    <tr>
                        <th>진행상태</th>
                        <td>
                            <label className="process_check">
                                <input
                                    type="radio"
                                    name="cntrctSttusCode"
                                    defaultValue=""
                                    defaultChecked={true}
                                />
                                전체
                            </label>
                            <label className="process_check">
                                <input type="radio" name="cntrctSttusCode" value="" />
                                계약진행중
                            </label>
                            <label className="process_check">
                                <input type="radio" name="cntrctSttusCode" value="" />
                                승인대기
                            </label>
                            <label className="process_check">
                                <input type="radio" name="cntrctSttusCode" value="" />
                                계약완료
                            </label>
                            <label className="process_check">
                                <input type="radio" name="cntrctSttusCode" value="" />
                                계약취소
                            </label>
                            <label className="process_check">
                                <input type="radio" name="cntrctSttusCode" value="" />
                                거절
                            </label>
                            <label className="process_check">
                                <input type="radio" name="cntrctSttusCode" value="" />
                                기한만료
                            </label>
                        </td>
                    </tr>
                    <tr>
                        <th>단어검색</th>
                        <td className="search_box clearFix">
                            <div className="table_input_box">
                                <input
                                    {...register("keyword")}
                                    type="text"
                                    placeholder="문서명을 입력해 주세요"
                                    defaultValue={conditionState ? conditionState.keyword : ""}
                                />
                            </div>
                            <button
                                type="submit"
                                className="btn primary_btn table_btn"
                            >
                                검색
                            </button>
                        </td>
                    </tr>
                </tbody>
            </table>
        </form>
    );
};

export default NewSearch;
