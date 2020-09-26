import neispy
import asyncio

name = "우신고등학교"


async def main():

    # 필수인자가 들어가는곳입니다. API키,json,xml등 받을방식등등..
    # 아무값이 없으니 샘플키로 요청합니다.
    neis = neispy.Client('e1fa7c85eafc46098f79c372457fa0b7')

    # 학교이름으로 학교정보를 요청하고 교육청코드 와 학교코드로 가져옵니다.
    scinfo = await neis.schoolInfo(ATPT_OFCDC_SC_CODE='H10', SCHUL_NM=name)
    AE = scinfo[0].ATPT_OFCDC_SC_CODE  # 교육청코드
    SE = scinfo[0].SD_SCHUL_CODE  # 학교코드

    # 학교코드와 교육청 코드로 2019년 1월 22일의 급식 정보 요청
    scmeal = await neis.mealServiceDietInfo(AE, SE, MLSV_YMD=20190312)
    meal = scmeal[0].DDISH_NM.replace("<br/>", "\n")  # 줄바꿈으로 만든뒤 출력

    '''
    # 학교코드와 교육청 코드로 2019년 3월 7일날 학사일정 요청
    scschedule = await neis.SchoolSchedule(AE, SE, AA_YMD=20190307)
    schedule = scschedule[0].EVENT_NM  # 학사일정명 가져옴

    # 학교코드와 교육청 코드로 초등학교의 2020년 1월 22일의 시간표가져옴
    sctimetable = await neis.timeTable("els", AE, SE, 2019, 2, 20200122, 1, 1)
    timetable = [i.ITRT_CNTNT for i in sctimetable]  # 리스트로 만듬

    academyinfo = await neis.acaInsTiInfo(AE)  # 교육청 코드로 학원및 교습소 정보 요청
    academy = academyinfo[0].ACA_NM  # 학교이름 출력

    # 학교코드와 교육청 코드로 1학년의 모든 반정보 요청
    scclass = await neis.classInfo(AE, SE, GRADE=1)
    class_info = [i.CLASS_NM for i in scclass]  # 리스트로만듬

    hiscinfo = await neis.schoolInfo(SCHUL_NM="인천기계")  # 다른정보를 위해 공고로 가져옴
    hAE = hiscinfo[0].ATPT_OFCDC_SC_CODE  # 교육청코드
    hSE = hiscinfo[0].SD_SCHUL_CODE  # 학교코드

    scmajorinfo = await neis.schoolMajorinfo(hAE, hSE)  # 학과정보 요청
    majorinfo = [m.DDDEP_NM for m in scmajorinfo]  # 리스트로 만듬

    scAflcoinfo = await neis.schulAflcoinfo(hAE, hSE)  # 학교 계열정보 요청
    Aflco = [a.ORD_SC_NM for a in scAflcoinfo]

    sctiClrm = await neis.tiClrminfo(hAE, hSE)  # 시간표 강의실 정보 요청
    tiClem = [t.CLRM_NM for t in sctiClrm]

    print(schedule)
    print(academy)
    print(class_info)
    print(timetable)
    print(majorinfo)
    print(Aflco)
    print(tiClem)

'''
    print(AE)
    print(SE)
    print(meal)
loop = asyncio.get_event_loop()
loop.run_until_complete(main())

#출력값

#E10
#7341038
#보리밥
#사과
#비엔나소시지케첩조림2.5.6.10.12.13.
#궁중떡볶이1.5.6.13.
#알타리김치9.13.
#청국장찌개(신)5.9.13.
#학급임원선거
#A+수학교습소
#['1', '2', '3', '4', '5']
#['즐거운생활', '수학', '국어', '즐거운생활']
#['기계과', '공동실습소', '건축과', '건축디자인과', '금속과']
#['공업계', '공동실습소', '공업계']
#['건축1-1', '건축1-2', '도시1-1', '도시1-2', '메카1-1']
