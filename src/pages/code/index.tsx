import { GridButtons } from '@components/Buttons'
import Search from '@components/Search'
// 내부 컴포넌트 및 custom hook, etc...
import CustomDataGrid from '@components/Table/CustomDataGrid'
import { GRID_PAGE_SIZE } from '@constants'
import usePage from '@hooks/usePage'
import useSearchTypes from '@hooks/useSearchType'
//api
import { codeService } from '@service'
import { conditionAtom, errorStateSelector } from '@stores'
import { Page, rownum } from '@utils'
import { AxiosError } from 'axios'
import { NextPage } from 'next'
import { TFunction, useTranslation } from 'next-i18next'
import { useRouter } from 'next/router'
import React, { useCallback, useMemo } from 'react'
// 상태관리 recoil
import { useRecoilValue, useSetRecoilState } from 'recoil'


const conditionKey = 'code'

// 실제 render되는 컴포넌트
const Code: NextPage = () => {
  // props 및 전역변수
  // const { id } = props
  const route = useRouter()

  const { t } = useTranslation()

  //조회조건 select items
  const searchTypes = useSearchTypes([
    {
      key: 'codeId',
      label: t('code.code_id'),
    },
    {
      key: 'codeName',
      label: t('code.code_name'),
    },
  ])

  /**
   * 상태관리 필요한 훅
   */
  //조회조건 상태관리
  const keywordState = useRecoilValue(conditionAtom(conditionKey))
  const setErrorState = useSetRecoilState(errorStateSelector)

  //현 페이지내 필요한 hook
  const { page, setPageValue } = usePage(conditionKey)

  //목록 데이터 조회 및 관리
  const { data, mutate } = codeService.search({
    keywordType: keywordState?.keywordType || 'codeId',
    keyword: keywordState?.keyword || '',
    size: GRID_PAGE_SIZE,
    page,
  })

  /**
   * 비지니스 로직
   */

  //에러 callback
  const errorCallback = useCallback((error: AxiosError) => {
    setErrorState({
      error,
    })
  }, [])

  // 코드상세목록
  const routeCodeDetail = useCallback((id: string) => {
    route.push(
      {
        pathname: '/code/detail',
        query: {
          parentCodeId: id,
        },
      },
      '/code/detail',
    )
  }, [])

  //삭제
  const deleteCode = useCallback((id: string) => {
    codeService.delete({
      callback: mutate,
      errorCallback,
      id,
    })
  }, [])

  //수정 시 상세 화면 이동
  const updateCode = useCallback((id: string) => {
    route.push(`/code/${id}`)
  }, [])

  //사용여부 toggle 시 바로 update
  const toggleIsUse = useCallback(
    async (event: React.ChangeEvent<HTMLInputElement>, id: string) => {
      codeService.updateUse({
        callback: mutate,
        errorCallback,
        id,
        useAt: event.target.checked,
      })
    },
    [page],
  )


  //목록 조회
  const handleSearch = () => {
    if (page === 0) {
      mutate(data, false)
    } else {
      setPageValue(0)
    }
  }

  //datagrid page change event
  const handlePageChange = (page: number, details?: any) => {
    setPageValue(page)
  }

  return (
    <div className={classes.root}>
      <Search
        keywordTypeItems={searchTypes}
        handleSearch={handleSearch}
        handleRegister={() => {
          route.push('code/-1')
        }}
        conditionKey={conditionKey}
      />
      <CustomDataGrid
        classes={classes}
        rows={data?.content}
        columns={columns}
        rowCount={data?.totalElements}
        paginationMode="server"
        pageSize={GRID_PAGE_SIZE}
        page={page}
        onPageChange={handlePageChange}
        getRowId={r => r.codeId}
      />
    </div>
  )
}

export default Code
