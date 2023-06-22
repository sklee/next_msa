import NewDataGrid from "@components/NewDataGrid";
import NewSearch from "@components/NewSearch";
import Search, { IKeywordType } from "@components/NewSearch";
import { PopupProps } from "@components/DialogPopup";
import { GRID_PAGE_SIZE } from "@constants";
import usePage from "@hooks/usePage";
import { contentService } from "@service";
import { conditionAtom, errorStateSelector } from "@stores";
import { AxiosError } from "axios";
import { NextPage } from "next";
import { useRouter } from "next/router";
import { useCallback, useMemo } from "react";
import { useTranslation } from "react-i18next";
import { useRecoilValue, useSetRecoilState } from "recoil";

const conditionKey = "content";
export interface ContractProps extends PopupProps { }


// 실제 render되는 컴포넌트
const Contract: NextPage<ContractProps> = ({ handlePopup }) => {
  const route = useRouter();
  const { t } = useTranslation();

  // 조회조건 select items
  const searchTypes: IKeywordType[] = [
    {
      key: "contentName",
      label: t("content.content_name"),
    },
  ];

  /**
   * 상태관리 필요한 훅
   */
  // 조회조건 상태관리
  const keywordState = useRecoilValue(conditionAtom(conditionKey));
  const setErrorState = useSetRecoilState(errorStateSelector);

  // 현 페이지내 필요한 hook
  const { page, setPageValue } = usePage(conditionKey);

  // 목록 데이터 조회 및 관리
  const { data, mutate } = contentService.search({
    keywordType: keywordState?.keywordType || "contentName",
    keyword: keywordState?.keyword || "",
    fromDate: keywordState?.fromDate || "",
    endDate: keywordState?.endDate || "",
    size: GRID_PAGE_SIZE,
    page,
  });

  /**
   * 비지니스 로직
   */

  // 에러 callback
  const errorCallback = useCallback(
    (error: AxiosError) => {
      setErrorState({
        error,
      });
    },
    [setErrorState]
  );

  // 삭제
  const deleteContent = useCallback(
    (contentNo: string) => {
      contentService.delete({
        contentNo,
        callback: mutate,
        errorCallback,
      });
    },
    [errorCallback, mutate]
  );

  // 수정 시 상세 화면 이동
  const updateContent = useCallback(
    (contentNo: string) => {
      route.push(`/content/${contentNo}`);
    },
    [route]
  );

  // 목록컬럼 재정의 > 컬럼에 비지니스 로직이 필요한 경우
  // const columns = useMemo(
  //   () => getColumns(data, deleteContent, updateContent, t, handlePopup),
  //   [data, deleteContent, updateContent, t, handlePopup],
  // )

  // 목록 조회
  const handleSearch = () => {
    if (page === 0) {
      mutate();
    } else {
      setPageValue(0);
    }
  };

  // datagrid page cchange event
  const handlePageChange = (page: number, details?: any) => {
    setPageValue(page);
  };

  const handleRegister = () => {
    route.push("content/-1");
  };
  return (
    <div id="sub_content">
      <h2 className="main_title">개인 주소록</h2>
      <a href="#none" className="btn add_btn secondary_btn"><i className="fas fa-plus plus_btn_i"></i> 주소록 추가</a>
      <div className="white_box box_shadow">
        <div className="table_box table_box_left table_box_mb_20">
          <table className="table_blue_top">
            <caption></caption>
            <colgroup>
              <col style={{ width: "10%" }} />
              <col style={{ width: "90%" }} />
            </colgroup>
            <tbody>
              <tr>
                <th>검색</th>
                <td className="search_box clearFix">
                  <div className="table_input_box">
                    <input type="text" placeholder="이름 / 이메일 / 휴대폰 번호로 검색" />
                  </div>
                  <a href="#none" className="btn primary_btn table_btn">검색</a>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
        <div className="table_box">
          <table>
            <caption></caption>
            <colgroup>
              <col style={{ width: "15%" }} />
              <col style={{ width: "45%" }} />
              <col style={{ width: "20%" }} />
              <col style={{ width: "20%" }} />
            </colgroup>
            <tbody>
              <tr>
                <td>
                  <label htmlFor="id_input" className="form_label_box table_input_box_es">
                    <input type="text" id="name" name="name" data-required-name="이름" maxLength={5}
                      required={true} />
                    <label htmlFor="name" className="form_label">이름</label>
                  </label>
                </td>
                <td>
                  <label htmlFor="id_input" className="form_label_box table_input_box_es">
                    <input type="text" id="name" name="name" data-required-name="이름" maxLength={5}
                      required={true} />
                    <label htmlFor="name" className="form_label">이메일</label>
                  </label>
                </td>
                <td>
                  <label htmlFor="id_input" className="form_label_box table_input_box_es">
                    <input type="text" id="name" name="name" data-required-name="이름" maxLength={5}
                      required={true} />
                    <label htmlFor="name" className="form_label">휴대폰 번호</label>
                  </label>
                </td>
                <td><a href="#none" className="btn sub_btn secondary_btn mr_10">완료</a><a href="#none"
                  className="btn sub_btn cancel_btn">취소</a>
                </td>
              </tr>
              <tr>
                <td>이름입니다</td>
                <td>이메일입니다</td>
                <td>전화번호 입니다</td>
                <td><a href="#none" className="btn sub_btn primary_btn mr_10">수정</a><a href="#none"
                  className="btn sub_btn danger_btn">삭제</a>
                </td>
              </tr>
              <tr>
                <td>이름입니다</td>
                <td>이메일입니다</td>
                <td>전화번호 입니다</td>
                <td><a href="#none" className="btn sub_btn primary_btn mr_10">수정</a><a href="#none"
                  className="btn sub_btn danger_btn">삭제</a>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default Contract;
