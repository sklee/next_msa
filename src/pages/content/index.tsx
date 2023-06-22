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

  const handleDelete = (contentNos: string[]) => {
    contentNos.map(contentNo => {
      deleteContent(contentNo);
    })
  }

  return (
    <div id="sub_content">
      <h2 className="main_title">계약현황</h2>

      <div className="white_box box_shadow">
        <NewSearch
          keywordTypeItems={searchTypes}
          handleRegister={handlePopup ? undefined : handleRegister}
          conditionKey={conditionKey}
        />
        {data && <NewDataGrid data={data} onDeleted={(contentNos: string[]) => handleDelete(contentNos)} />}
      </div>
    </div>
  );
};

export default Contract;
