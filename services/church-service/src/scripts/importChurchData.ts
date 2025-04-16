import mongoose from 'mongoose';
import { Church } from '../models/Church';
import fs from 'fs';
import path from 'path';

interface IChurch {
  mainId: string;
  subId: string;
  name: string;
  location: string;
}

interface ISampleEvent {
  sampleEvent_ID: number;
  sampleEvent_Name: string;
  sampleEvent_Location: string;
  sampleEvent_Year: string;
  sampleEvent_Start_Date: string | null;
  sampleEvent_End_Date: string | null;
  sampleEvent_Registration_Start_Date: string | null;
  sampleEvent_Registration_End_Date: string | null;
  sampleEvent_Open_Available: '공개' | '비공개';
  sampleEvent_Place: string;
  sampleEvent_Month: string;
}

// 하드코딩된 교회 데이터
const churches: IChurch[] = [
  { mainId: '0003', subId: 'a', name: '수원중앙침례교회 (Suwon Central Baptist Church)', location: '경기 용인시 수지구 포은대로 91-19 중앙예닮학교' },
    { mainId: '0012', subId: 'a', name: '할렐루야교회 (HALLELUJAH COMMUNITY CHURCH)', location: '경기 성남시 분당구 야탑동 132번지' },
    { mainId: '0020', subId: 'a', name: '방어진제일교회 (BANGEO JINJEIL PRESBYTERIAN CHURCH)', location: '울산 동구 북진5길 15 방어진제일교회' },
    { mainId: '0021', subId: 'a', name: '할렐루야 (Hallelujah)', location: '경기 성남시 분당구 야탑로 368 할렐루야교회' },
    { mainId: '0027', subId: 'a', name: '원천교회 (Wonchon Baptist Church)', location: '경기 수원시 영통구 월드컵로 70 원천교회' },
    { mainId: '0034', subId: 'a', name: '샘물 (Saemmul)', location: '경기 성남시 분당구 내정로17번길 8' },
    { mainId: '0042', subId: 'a', name: '일산동안교회 (ilsandongan)', location: '경기 고양시 일산동구 백석동 1177 일산동안교회' },
    { mainId: '0044', subId: 'a', name: '여천제일교회 (Yeocheon Jeil Church)', location: '전남 여수시 무선3길 23 (선원동, 여천제일교회)' },
    { mainId: '0045', subId: 'a', name: '서둔교회 (seodoon)', location: '경기 수원시 권선구 서둔동 서호서로 21번길 50-30' },
    { mainId: '0048', subId: 'a', name: '김해중앙교회 (Gimhae Jungang)', location: '경남 김해시 흥동로 7 김해중앙교회' },
    { mainId: '0049', subId: 'a', name: '김해제일교회 (gimhaejeil church)', location: '경남 김해시 호계로 488 김해제일교회' },
    { mainId: '0052', subId: 'a', name: '조은침례교회 (JOEUN BAPTIST CHURCH)', location: '경기 화성시 봉담읍 동화역말길 33 조은침례교회' },
    { mainId: '0054', subId: 'a', name: '일산대림교회 (DaeLim Church)', location: '경기 고양시 일산서구 탄현로6번길 2 대림교회' },
    { mainId: '0055', subId: 'a', name: '예능교회 (Yehneung)', location: '서울 종로구 평창문화로 81-5' },
    { mainId: '0057', subId: 'a', name: '홈스쿨어와나 (Homeschool Awana)', location: '경기 광주시 퇴촌면 오리 59-1 은혜농원' },
    { mainId: '0058', subId: 'a', name: '공주 꿈의교회 (Church of Dreams)', location: '충남 공주시 백제문화로 2148-5 공주 꿈의교회' },
    { mainId: '0058', subId: 'b', name: '글로리채플 (glory chaple)', location: '세종특별자치시 새롬중앙로 64 5층 글로리채플' },
    { mainId: '0058', subId: 'c', name: '세종꿈의교회 (Church of Dream)', location: '세종특별자치시 노을3로 70 세종꿈의교회' },
    { mainId: '0058', subId: 'd', name: '대전 꿈의교회 (The church of dream)', location: '대전 유성구 반석동 반석역 프라자 3,4층 꿈의교회' },
    { mainId: '0058', subId: 'e', name: '새로운꿈의교회 (New dream church)', location: '세종특별자치시 법원2로 18 6층 새로운꿈의교회' },
    { mainId: '0058', subId: 'f', name: '대전꿈의교회 (Daejeon Dream Church)', location: '대전 유성구 반석로 10 3층 대전꿈의교회' },
    { mainId: '0062', subId: 'a', name: '일산장로교회 (Ilsan Presbyterian Church)', location: '경기 고양시 일산동구 중산로 231 일산장로교회' },
    { mainId: '0062', subId: 'b', name: '금광교회 (kuemkwangchurch)', location: '경기 성남시 수정구 양지동 923-1 금광교회 비전센터' },
    { mainId: '0066', subId: 'a', name: '순천중앙교회 (suncheon central church)', location: '전남 순천시 서문성터길 20' },
    { mainId: '0067', subId: 'a', name: '주님의교회 (The Presbyterian Church of the Lord)', location: '서울 송파구 올림픽로4길 16 정신여고내 주님의교회' },
    { mainId: '0068', subId: 'a', name: '금광교회 (Kuemkwang)', location: '경기 성남시 수정구 산성대로 613' },
    { mainId: '0069', subId: 'a', name: '남부전원교회 (namboochurchi)', location: '경기 평택시 지산동 남부전원교회' },
    { mainId: '0072', subId: 'a', name: '대전서문교회 (Daejeon Seomun Church)', location: '대전 중구 산성로138번길 8 대전서문교회' },
    { mainId: '0075', subId: 'a', name: '남서울교회 (nschurch)', location: '서울 서초구 신반포로19길 6 남서울교회' },
    { mainId: '0079', subId: 'a', name: '은혜로교회 (By Grace Presbyterian Church)', location: '부산 사상구 대동로 14 은혜로교회' },
    { mainId: '0080', subId: 'a', name: '프레젠트스쿨 (present school)', location: '경기 광명시 하안3동 296-3번지 한우리비전센터 4층 나실인학교' },
    { mainId: '0081', subId: 'a', name: '수원성교회 (suwonsung)', location: '경기 수원시 장안구 덕영대로439번길 18-10' },
    { mainId: '0082', subId: 'a', name: '일산 사랑의 교회 (ilsansarang community church)', location: '경기 고양시 일산동구 성석동 1061-38 일산 사랑의 교회' },
    { mainId: '0083', subId: 'a', name: '수원북부교회 (SuWon BukBu Community Church)', location: '경기 수원시 장안구 이목로 69 (이목동)' },
    { mainId: '0084', subId: 'a', name: '지구촌교회 (GLOBAL MISSION CHURCH)', location: '경기 성남시 분당구 미금일로154번길 6 지구촌교회' },
    { mainId: '0085', subId: 'a', name: '세대로교회 (Church of SEDAERO)', location: '서울 송파구 가락로 25' },
    { mainId: '0086', subId: 'a', name: '이삭교회 (Isaac Presbyterian Church)', location: '경기 남양주시 평내동 604-7 드림타워 5층 이삭교회' },
    { mainId: '0087', subId: 'a', name: '대덕한빛교회 (Daeduk Hanbit Presbyterian Church)', location: '대전 유성구 어은로58번길 50 대덕한빛교회' },
    { mainId: '0092', subId: 'a', name: '온누리교회 (Onnuri Community Church)', location: '서울 용산구 이촌로 347-11' },
    { mainId: '0093', subId: 'a', name: '은혜의교회 (grace)', location: '인천 미추홀구 매소홀로 428' },
    { mainId: '0096', subId: 'a', name: '향상교회 (Hyangsang Church)', location: '경기 용인시 기흥구 언동로 140 향상교회' },
    { mainId: '0102', subId: 'a', name: '구파발교회 (GUPABAL CHURCH)', location: '서울 은평구 진관2로 35' },
    { mainId: '0103', subId: 'a', name: '순천제일교회 (SUNCHEONJEIL)', location: '전남 순천시 해룡면 상성길 222 101동 2502호' },
    { mainId: '0104', subId: 'a', name: '가나안교회 (CANAAN CHURCH)', location: '경기 성남시 분당구 미금로 34 가나안교회' },
    { mainId: '0105', subId: 'a', name: '평촌교회 (Pyungchon church)', location: '경기 안양시 동안구 흥안대로 390 평촌교회' },
    { mainId: '0108', subId: 'a', name: '대구대동교회 (Daedong Presbyterian Church)', location: '대구 수성구 범어동 167-2' },
    { mainId: '0109', subId: 'a', name: '춘천중앙성결교회 ( Chuncheon Central Holiness Church)', location: '강원특별자치도 춘천시 약사고개길 14 춘천중앙성결교회' },
    { mainId: '0110', subId: 'a', name: '울산교회 (Ulsan Church)', location: '울산 중구 장춘로 165-7' },
    { mainId: '0115', subId: 'a', name: '갈보리교회 (CALVARY CHURCH)', location: '경기 성남시 분당구 이매로 132 갈보리교회' },
    { mainId: '0117', subId: 'a', name: '예산침례교회 (THE YESAN BAPTIST CHURCH)', location: '충남 예산군 예산읍 예산2리 153번지/ 예산읍 임성로 30' },
    { mainId: '0122', subId: 'a', name: '목동제일교회 (mokdongjeil church)', location: '서울 양천구 신정7동 324-2' },
    { mainId: '0123', subId: 'a', name: '여수성광교회 (Yeosu Seonggwang Church)', location: '전남 여수시 좌수영로 109 여수성광교회' },
    { mainId: '0124', subId: 'a', name: '목동제일교회 (Mokdongjeil Church)', location: '서울 양천구 목동서로 391 목동제일교회' },
    { mainId: '0127', subId: 'a', name: '백석대학교회 (baekseok university presbyterian church)', location: '서울 서초구 효령로 114 백석비전센터 1층 교회사무실' },
    { mainId: '0130', subId: 'a', name: '이리신광교회 (irishinkwangchurch)', location: '전북특별자치도 익산시 고봉로 60' },
    { mainId: '0131', subId: 'a', name: '창훈대교회 (GHANG HUM DAI PRESBYTERY CHURCH)', location: '경기 수원시 장안구 연무로 26 창훈대교회' },
    { mainId: '0132', subId: 'a', name: '상도중앙교회 (SANGDO CENTRAAL PRESBYTERIAN CHURCH)', location: '서울 동작구 상도동 484번지(상도로 55길 16)' },
    { mainId: '0133', subId: 'a', name: '한신교회 (hanshin church)', location: '경기 성남시 분당구 삼평동 739번시 한신교회' },
    { mainId: '0134', subId: 'a', name: '홍릉교회 (HONGLEUNG)', location: '서울 동대문구 청량리동 205-102' },
    { mainId: '0135', subId: 'a', name: '수지기쁨의교회 (SUJIJOYFUL CHURCH)', location: '경기 용인시 수지구 진산로11번길 29 풍덕천동 1156' },
    { mainId: '0136', subId: 'a', name: '장평교회 (JANGPYUNG CHURCH)', location: '경남 거제시 신현읍 장평리 238번지(장평3로19)' },
    { mainId: '0139', subId: 'a', name: '꿈의교회 (DREAM CHURCH)', location: '경기 안산시 상록구 용신로 131' },
    { mainId: '0140', subId: 'a', name: '여의도침례교회 (YOIDO BAPTIST CHURCH)', location: '서울 영등포구 국제금융로 118' },
    { mainId: '0140', subId: 'b', name: '선두교회 (SUNDOO)', location: '인천 서구 석남동 547-23' },
    { mainId: '0141', subId: 'a', name: '수원순복음교회 (Suwon Full Gospel Church)', location: '경기 수원시 권선구 덕영대로 1334' },
    { mainId: '0143', subId: 'a', name: '수원온누리비전교회 (Suwon Onnuri vision churc)', location: '경기 수원시 영통구 매영로 219-13 온누리비전교회' },
    { mainId: '0144', subId: 'a', name: '은현교회 (Eun hyun)', location: '전남 여수시 여서2로 51 (여서동, 은현교회) 은현교회' },
    { mainId: '0151', subId: 'a', name: '세종산성교회 (sansung)', location: '세종특별자치시 다정북로 90 1층사무실' },
    { mainId: '0151', subId: 'a', name: '세종산성교회 (sejongsansungchurch)', location: '세종특별자치시 다정북로 90 세종산성교회' },
    { mainId: '0152', subId: 'a', name: '성공회제자교회 (The englican church of korea Jeja church)', location: '경기 오산시 세남로14번길 25 (세교동, 성공회제자교회) 세마동' },
    { mainId: '0153', subId: 'a', name: '왕성교회 (WANGSUNGCHURCH)', location: '서울 관악구 신림로 308 왕성교회' },
    { mainId: '0154', subId: 'a', name: '수원제일교회 (suwonch)', location: '경기 수원시 팔달구 팔달문로57번길 3' },
    { mainId: '0156', subId: 'a', name: '장석교회 (Jangsuk)', location: '서울 노원구 월계로44길 23' },
    { mainId: '0157', subId: 'a', name: '의왕예전교회 (yejun church)', location: '경기 의왕시 경수대로391번길 7 의왕예전교회' },
    { mainId: '0158', subId: 'a', name: '본교회 (BON CUHRCH)', location: '서울 성북구 삼선교로 54' },
    { mainId: '0159', subId: 'a', name: '광천교회 (Gwangcheon church)', location: '광주 서구 천변좌하로 472 광천교회' },
    { mainId: '0160', subId: 'a', name: '인천선두교회 (sundoo)', location: '인천 서구 거북로109번길 10' },
    { mainId: '0170', subId: 'a', name: '성석교회 (sungsuk)', location: '서울 강서구 곰달래로47길 18' },
    { mainId: '0174', subId: 'a', name: '강서제일교회 (kangso jeil presbyterian church)', location: '서울 양천구 목1동 405-183' },
    { mainId: '0177', subId: 'a', name: '대구신암교회 (shinam presbyterian church)', location: '대구 동구 아양로14길 17' },
    { mainId: '0178', subId: 'a', name: '오천교회 (ocheon church)', location: '경기 이천시 마장면 양촌리 중부대로 123 오천교회' },
    { mainId: '0180', subId: 'a', name: '대화교회 (daehwa)', location: '경기 고양시 일산동구 장항2동 901번지' },
    { mainId: '0181', subId: 'a', name: '강남교회 (KANGNAM COMMUNITY CHURCH)', location: '서울 강서구 화곡6동 957-10' },
    { mainId: '0182', subId: 'a', name: '대공원교회 (daegongwon church)', location: '서울 광진구 자양로39길 21 (구의동, 대공원교회) 구의동614-5' },
    { mainId: '0183', subId: 'a', name: '잠실중앙교회 (Jamsiljoongang Church)', location: '서울 송파구 올림픽로35길 118 잠실중앙교회' },
    { mainId: '0184', subId: 'a', name: '영도교회 (Young Do Church)', location: '경기 성남시 중원구 둔촌대로 311' },
    { mainId: '0187', subId: 'a', name: '제광교회 (JEKWANG Church)', location: '제주특별자치도 제주시 도남로 3' },
    { mainId: '0190', subId: 'a', name: '부천중동교회 (joongdong church)', location: '경기 부천시 원미구 상일로 48 중동교회' },
    { mainId: '0192', subId: 'a', name: '서울외국인학교 (Seoul Foreign School)', location: '서울 서대문구 연희로22길 39' },
    { mainId: '0197', subId: 'a', name: '대구동일교회 (dongil presbyterian church)', location: '대구 동구 신천3동 147-1' },
    { mainId: '0198', subId: 'a', name: '내수동교회 (Naesoo Church)', location: '서울 종로구 내수동 110-8 내수동교회' },
    { mainId: '0199', subId: 'a', name: '이천은광교회 (이천은광교회(ieunkwang))', location: '경기 이천시 구만리로 313' },
    { mainId: '0203', subId: 'a', name: '안락교회 (Allak)', location: '부산 동래구 충렬대로 367 어와나' },
    { mainId: '0204', subId: 'a', name: '부산북교회 (BUSANBUK CHURCH)', location: '부산 부산진구 전포대로300번길 26 부산북교회' },
    { mainId: '0204', subId: 'b', name: '성실교회 (SEONG-SIL)', location: '서울 강북구 노해로 50 (수유동, 성실교회) 수유3동 221-49' },
    { mainId: '0205', subId: 'a', name: '선한목자교회 (good shepherd methodist church)', location: '경기 성남시 수정구 성남대로1518번길 9' },
    { mainId: '0206', subId: 'a', name: '성실교회 (Seongsil-Church)', location: '서울 강북구 수유3동 221-49 성실교회' },
    { mainId: '0207', subId: 'a', name: '창원세광교회 (Changwon sekwang church)', location: '경남 창원시 성산구 충혼로 188 창원세광교회' },
    { mainId: '0208', subId: 'a', name: '포항충진교회 (Pohang Chungjin Church)', location: '경북 포항시 남구 희망대로 414 포항충진교회' },
    { mainId: '0209', subId: 'a', name: '신월동 교회 (shinwol)', location: '서울 양천구 남부순환로54길 9 (신월동) 9(신월동)' },
    { mainId: '0210', subId: 'a', name: '늘사랑교회 (everlove)', location: '대전 유성구 은구비로 82' },
    { mainId: '0216', subId: 'a', name: '인천예은교회 (InchoenYeeunChurch)', location: '인천 연수구 동춘동 533-16 예은빌딩 5층' },
    { mainId: '0219', subId: 'a', name: '순천동명교회 (scdongmyung)', location: '전남 순천시 연동남길 17 순천동명교회' },
    { mainId: '0220', subId: 'a', name: '성산교회 (sungsan presbyterian church)', location: '경기 성남시 중원구 금광동 181' },
    { mainId: '0222', subId: 'a', name: '예스교회 (YES CHURCH)', location: '경북 문경시 모전동 매봉6길16 (2층)' },
    { mainId: '0224', subId: 'a', name: '동백사랑의교회 (dongback sarang)', location: '경기 용인시 기흥구 동백중앙로16번길 57 동백사랑의교회' },
    { mainId: '0229', subId: 'a', name: '좋은교회 (THE GOOD CHURCH)', location: '충북 청주시 서원구 남이면 석판2길 6-24' },
    { mainId: '0231', subId: 'a', name: '성심교회 (sung sim)', location: '경기 용인시 기흥구 지곡동 292-9번지' },
    { mainId: '0232', subId: 'a', name: '광주성결교회 (gwangju holiness church)', location: '경기 광주시 통미로 36' },
    { mainId: '0235', subId: 'a', name: '대영교회 (DAEYEONG CHURCH)', location: '울산 북구 상방로 180 대영교회' },
    { mainId: '0236', subId: 'a', name: '수정동성결교회 (SUJEONGDONG EVANGELICAL HOLINESS CHURCH)', location: '부산 동구 수정동 고관로 89' },
    { mainId: '0238', subId: 'a', name: '거룩한빛광성교회 (Holy Light Kwangseong Church)', location: '경기 고양시 일산서구 경의로 956 1층 사무실' },
    { mainId: '0240', subId: 'a', name: '소망침례교회 (SOMANG Baptists CHURCH)', location: '경북 상주시 함창읍 함창로 518 (윤직리) 소망침례교회' },
    { mainId: '0241', subId: 'a', name: '성남성도교회 (sung do presbyterian church)', location: '경기 성남시 수정구 탄리로52번길 28' },
    { mainId: '0242', subId: 'a', name: '수원동부교회 (Suwon-Dongbu Church)', location: '경기 수원시 영통구 매탄동 신원로 226' },
    { mainId: '0243', subId: 'a', name: '온천제일교회 (Oncheon First Church)', location: '부산 동래구 금강로151번길 12' },
    { mainId: '0244', subId: 'a', name: '경산중앙교회 (Gyeongsan Jung Ang Presbyterian Church)', location: '경북 경산시 강변동로 358 경산중앙교회' },
    { mainId: '0245', subId: 'a', name: '명성제일교회 (Myungsungjeil church)', location: '경기 수원시 영통구 매영로 329 명성제일교회' },
    { mainId: '0247', subId: 'a', name: '혜성교회 (HyesungChurch)', location: '서울 종로구 혜화동 5-55번지 혜성교회' },
    { mainId: '0251', subId: 'a', name: '남서울은혜교회 (NamSeoulGrace Church )', location: '서울 강남구 일원로 90' },
    { mainId: '0252', subId: 'a', name: '시은소교회 (SIEUNSO PRESBYTERIAN CHURCH)', location: '경기 수원시 영통구 이의동 419-2 시은소교회' },
    { mainId: '0253', subId: 'a', name: '원주의과대학교회 (Wonju College of Medicin Church)', location: '강원 원주시 일산동 연세대학교원주의과대학기독병원 교목실' },
    { mainId: '0254', subId: 'a', name: '새누리2교회 (SAENUREE2)', location: '대전 유성구 노은로367번길 46 새누리 2교회' },
    { mainId: '0255', subId: 'a', name: '인천성안교회 (sungan)', location: '인천 연수구 선학로68번길 16 인천성안교회' },
    { mainId: '0256', subId: 'a', name: '광주새순교회 (gwangju saesoon community church)', location: '광주 북구 일곡동 46-25' },
    { mainId: '0257', subId: 'a', name: '신일교회 (Shinil church)', location: '경기 안양시 만안구 안양4동 414 신일교회' },
    { mainId: '0258', subId: 'a', name: '산북교회 (SANBUK)', location: '경기 양주시 산북동 319번지 산북교회' },
    { mainId: '0263', subId: 'a', name: '광림교회 (kwanglim church)', location: '서울 강남구 논현로175길 49 광림교회' },
    { mainId: '0265', subId: 'a', name: '동탄지구촌교회 (dongtan global church)', location: '경기 화성시 동탄면 중리 64번지' },
    { mainId: '0266', subId: 'a', name: '오산장로교회 (OSAN)', location: '경기 오산시 오산로 91-28 오산장로교회' },
    { mainId: '0268', subId: 'a', name: '효성교회 (Hyosung Presbyterian Church)', location: '서울 서초구 방배동 889-4번지, 효성교회' },
    { mainId: '0269', subId: 'a', name: '대한예수교장로회 창동염광교회 (chang-dong yumkwang presbyterian church)', location: '서울 도봉구 도봉로120길 16 창동염광교회' },
    { mainId: '0270', subId: 'a', name: '등대열방교회 (Light House All Nations Community)', location: '경남 양산시 물금읍 신창비바패밀리 아파트 상가 410호' },
    { mainId: '0271', subId: 'a', name: '큰은혜교회 (Amazing Grace Church)', location: '서울 관악구 낙성대로3길 5 큰은혜교회 1층 종합봉사실' },
    { mainId: '0273', subId: 'a', name: '시민의교회 (siminchurch )', location: '경기 군포시 고산로517번길 12 시민의교회' },
    { mainId: '0274', subId: 'a', name: '말씀의교회 (the Bible Church)', location: '경기 의정부시 평화로202번길 11-5 말씀의교회' },
    { mainId: '0275', subId: 'a', name: '안동교회 (Andong Presbyterian Church )', location: '경북 안동시 화성동 151-2 안동교회' },
    { mainId: '0276', subId: 'a', name: '만수감리교회 (Mansu Methodist Church)', location: '인천 남동구 만수6동 1073-4 만수감리교회' },
    { mainId: '0278', subId: 'a', name: '사랑과 평안의 교회 (The general council of the assemblies of God church for Love&Peace)', location: '서울 영등포구 도신로53길 9' },
    { mainId: '0279', subId: 'a', name: '새빛교회 (SAEBIT CHURCH)', location: '경기 하남시 대청로116번길 10 새빛교회' },
    { mainId: '0283', subId: 'a', name: '숭의교회 (Soong- eui church)', location: '인천 미추홀구 독배로 485' },
    { mainId: '0284', subId: 'a', name: '용천교회 (YongChun)', location: '경기 용인시 처인구 이동면 천리 천리 731' },
    { mainId: '0286', subId: 'a', name: '오산침례교회 (Osan Baptist Church)', location: '경기 오산시 은여울로 17 오산침례교회' },
    { mainId: '0287', subId: 'a', name: '진주교회 (Jinju)', location: '경남 진주시 의병로250번길 16' },
    { mainId: '0288', subId: 'a', name: '대전충만교회 (Daejeon Fullness Church)', location: '대전 대덕구 신탄진동 118-5, 5층' },
    { mainId: '0290', subId: 'a', name: '하늘빛우리교회 (HANULBIT WOORI CHURCH)', location: '경기 오산시 독산성로232번길 14-19 하늘빛우리교회' },
    { mainId: '0291', subId: 'a', name: '용인교회 (yonginchurch)', location: '경기 용인시 처인구 마평동 566 용인교회' },
    { mainId: '0292', subId: 'a', name: '능곡교회 (Neunggok Presbyterian Church)', location: '경기 고양시 덕양구 토당동 104번길 33-12' },
    { mainId: '0294', subId: 'a', name: '대전은평교회 (Daejeon Eunpyeong Church)', location: '대전 서구 변동 254-227' },
    { mainId: '0296', subId: 'a', name: '분당우리교회 (Bundang Woori Church)', location: '경기 성남시 분당구 황새울로311번길 9 분당우리교회 드림센터' },
    { mainId: '0297', subId: 'a', name: '공군중앙교회 (Air force central church)', location: '서울 동작구 여의대방로36길 92' },
    { mainId: '0299', subId: 'a', name: '신부산교회 (SHINBUSAN CHURCH)', location: '부산 수영구 무학로9번길 6 신부산교회' },
    { mainId: '0300', subId: 'a', name: '센텀영안교회 (Centum Youngahn Baptist Church)', location: '부산 해운대구 해운대로76번길 34' },
    { mainId: '0301', subId: 'a', name: '성서교회 (sungseo)', location: '경기 용인시 수지구 죽전2동 513-6' },
    { mainId: '0303', subId: 'a', name: '한동교회 (Han-Dong Church)', location: '경기 용인시 수지구 풍덕천동 465-2 한동교회' },
    { mainId: '0304', subId: 'a', name: '광주양림교회 (Gwangju Yangrim Presbyterian Church)', location: '광주 남구 백서로70번길 2' },
    { mainId: '0305', subId: 'a', name: '주품교회 (JUPUM PRESBYTERIAN CHURCH)', location: '경기 광명시 소하2동 313-14' },
    { mainId: '0307', subId: 'a', name: '한국중앙교회 (Korea Central Presbyterian Church)', location: '서울 광진구 중곡동 169-8' },
    { mainId: '0308', subId: 'a', name: '은석교회 (eunseok)', location: '인천 미추홀구 경원대로864번길 62' },
    { mainId: '0309', subId: 'a', name: '동래중앙교회 (DONGNAE CENTRAL PRESBYTERIAN CHURCH)', location: '부산 동래구 수안동 충렬대로 202번가길 24 동래중앙교회' },
    { mainId: '0310', subId: 'a', name: '정원교회 (Jungwon Presbyterian Church)', location: '서울 강동구 상일동 187-1' },
    { mainId: '0311', subId: 'a', name: '영도교회 (YOUNGDO CHURCH)', location: '서울 영등포구 도신로29사길 6 영도교회' },
    { mainId: '0314', subId: 'a', name: '부산사랑의교회 (bslchurch)', location: '부산 사하구 낙동대로 417 3층 부산사랑의교회' },
    { mainId: '0315', subId: 'a', name: '프랑크푸르트 한마음교회 (hanmaum church)', location: '서울 송파구 새말로 102' },
    { mainId: '0317', subId: 'a', name: '난곡신일 (nangokshinil)', location: '서울 관악구 난곡로 236 1층' },
    { mainId: '0318', subId: 'a', name: '프랑크푸르트 한마음교회 (frankfurt hanmaum church)', location: '서울 송파구 문정동 동남로6길 31-10 403호' },
    { mainId: '0319', subId: 'a', name: '사이공한인연합교회 (KOREAN UNION CHURCH of SAIGON)', location: '경기 시흥시 매화우회로 37 홍익아파트 201동 1701호' },
    { mainId: '0320', subId: 'a', name: '새희망교회 (New Hope Presbyterian Church)', location: '광주 광산구 첨단과기로 79-5' },
    { mainId: '0321', subId: 'a', name: '사랑나눔 (SARANGNANUM)', location: '전남 순천시 가곡동 고지5길 20-8' },
    { mainId: '0322', subId: 'a', name: '새벽길교회 (Good Morning Church)', location: '경기 남양주시 진접읍 부평리 613-4 4층 새벽길교회' },
    { mainId: '0327', subId: 'a', name: '역곡동교회 (youkgok)', location: '경기 부천시 원미구 역곡로46번길 61 역곡동교회 Awana' },
    { mainId: '0329', subId: 'a', name: '광진 (kwangjin)', location: '서울 구로구 개봉3동 294-7' },
    { mainId: '0334', subId: 'a', name: '풍암전원교회 (Pung Am Jeon Won Presbyterian Church)', location: '광주 서구 풍암동 풍금로 11번길 17' },
    { mainId: '0338', subId: 'a', name: '신촌교회 (shinchon church)', location: '서울 마포구 신촌로12길 11 키움관 2층' },
    { mainId: '0341', subId: 'a', name: '공군수원기지교회 (Suwon Airbase Church)', location: '경기 수원시 권선구 정조로 409 (세류동) 사서함 303-1호' },
    { mainId: '0342', subId: 'a', name: '맑은샘광천교회 (kwangchunchurch)', location: '서울 성북구 화랑로 192 맑은샘광천교회' },
    { mainId: '0343', subId: 'a', name: '동현교회 (DongHyunChurch)', location: '서울 송파구 방이동 64-12' },
    { mainId: '0349', subId: 'a', name: '과천교회 (Gwacheon Church)', location: '경기 과천시 중앙동 73' },
    { mainId: '0350', subId: 'a', name: '동숭교회 (Dong Soong)', location: '서울 종로구 이화장길 94' },
    { mainId: '0351', subId: 'a', name: '만리현교회 (marihyunchuch)', location: '서울 용산구 효창동 3-6' },
    { mainId: '0352', subId: 'a', name: '발음 (Baleum)', location: '서울 강서구 강서로47다길 35' },
    { mainId: '0353', subId: 'a', name: '대전 주함께 교회 (trinity world mission church)', location: '대전 중구 호동 80-7' },
    { mainId: '0355', subId: 'a', name: '고척교회 (Gocheok)', location: '서울 구로구 중앙로 79 고척교회' },
    { mainId: '0356', subId: 'a', name: '땅그랑 교민교회 (Tangerang GyoMin)', location: '강원 평창군 진부면 상진부리 11-1' },
    { mainId: '0357', subId: 'a', name: '군서교회 (Gun-suh church)', location: '경기 시흥시 봉우재로 30 3-2' },
    { mainId: '0359', subId: 'a', name: '창원중앙동교회 (JUNG ANGDONG)', location: '경남 창원시 성산구 원이대로552번길 23-4' },
    { mainId: '0360', subId: 'a', name: '샘물교회 (Saemmul Community Church)', location: '경기 성남시 분당구 정자동 131-1' },
    { mainId: '0361', subId: 'a', name: '광주반석교회 (Gwang Ju Bansuk Church)', location: '광주 광산구 여대길 220 광주반석교회' },
    { mainId: '0362', subId: 'a', name: '주북교회 (JUBUK CHURCH)', location: '경기 용인시 처인구 양지면 주북리 697번지' },
    { mainId: '0363', subId: 'a', name: '인천성린교회 (sungrin)', location: '인천 서구 장고개로293번길 25 인천성린교회' },
    { mainId: '0364', subId: 'a', name: '숭인교회 (soongin church)', location: '서울 종로구 숭인동 20-198' },
    { mainId: '0365', subId: 'a', name: '예수마음교회 (Heart of Jesus Methodist Church)', location: '경기 성남시 수정구 태평동 1826 2층' },
    { mainId: '0368', subId: 'a', name: '울산대흥교회 (ULSAN DAE HEUNG)', location: '울산 남구 문수로 461' },
    { mainId: '0370', subId: 'a', name: '양지문교회 (Yangjimoon Church)', location: '광주 북구 양산동 969번지' },
    { mainId: '0371', subId: 'a', name: '오창대교회 (OCHANG GREAT CHURCH)', location: '충북 청원군 오창면 각리 646-5 오창대교회' },
    { mainId: '0372', subId: 'a', name: '강내교회 (Kangnae Presbyterian Church)', location: '충북 청주시 흥덕구 강내면 가로수로 552' },
    { mainId: '0372', subId: 'b', name: '포항중앙교회 (POHANG CENTRAL PRESBYTERIAN CHURCH)', location: '경북 포항시 북구 대해로 27 포항중앙교회' },
    { mainId: '0373', subId: 'a', name: '서울남 (Seoul-Nam)', location: '서울 구로구 구로2동 708-25' },
    { mainId: '0374', subId: 'a', name: '청북교회 (Cheong-buk church)', location: '충북 청주시 청원구 내덕동 308-2 청북교회' },
    { mainId: '0375', subId: 'a', name: '안암제일교회 (anamjeil church)', location: '서울 동대문구 약령시로3길 50-1 안암제일교회' },
    { mainId: '0377', subId: 'a', name: '예닮제자교회 (yedarmjeja gyohoe)', location: '전북 전주시 완산구 서신동 856-1 6층' },
    { mainId: '0383', subId: 'a', name: '한소망교회 (HANSOMANG CHURCH)', location: '경기 파주시 경의로 983 한소망교회' },
    { mainId: '0385', subId: 'a', name: '내당교회 (NaeDang)', location: '대구 달서구 달구벌대로 1874 (두류동) 내당교회' },
    { mainId: '0388', subId: 'a', name: '안산빛나교회 (ANSAN VITNA PRESBYTERIAN CHURCH)', location: '경기 안산시 단원구 원포공원1로 12 안산빛나교회' },
    { mainId: '0389', subId: 'a', name: '울산남부교회 (ulsan Nambu Church)', location: '울산 남구 팔등로 64 울산남부교회' },
    { mainId: '0390', subId: 'a', name: '청라세계비전교회 (All Nations Vision Chuch)', location: '인천 서구 청라커낼로 263' },
    { mainId: '0392', subId: 'a', name: '참좋은교회 (Real Good Church)', location: '경기 고양시 덕양구 삼송동 세솔로98 참좋은교회' },
    { mainId: '0393', subId: 'a', name: '일산우리교회 (ilsan uri church)', location: '경기 고양시 일산동구 정발산동 대산로31번길 3우리교회3층' },
    { mainId: '0394', subId: 'a', name: '광음교회 (Kwangeum Church)', location: '인천 부평구 체육관로 82 (삼산동, 광음) 광음교회' },
    { mainId: '0397', subId: 'a', name: '하늘꿈교회 (HPC)', location: '강원특별자치도 동해시 청운3길 48-1' },
    { mainId: '0399', subId: 'a', name: '광주소망교회 (Gwangju Somang Church )', location: '광주 북구 상촌로 18 양산동 209-165' },
    { mainId: '0400', subId: 'a', name: '논현주안장로교회 (NONHYUNJUAN)', location: '인천 남동구 논현동 소래역서로1-11' },
    { mainId: '0401', subId: 'a', name: '꿈과사랑의교회 (Dream and Love Church)', location: '경기 의왕시 내손1동 757-4 반도프라자 4층' },
    { mainId: '0402', subId: 'a', name: '속초중앙교회 (Sokcho Central Presbyterian Church)', location: '강원특별자치도 속초시 번영로 30 속초중앙교회' },
    { mainId: '0405', subId: 'a', name: '대현교혹 (Daehyun Presbyterian church)', location: '대구 남구 이천로 57 (남구청 옆)' },
    { mainId: '0408', subId: 'a', name: '대구남부교회 (Nambu church)', location: '대구 중구 중앙대로 298 남부교회 1층 사무실' },
    { mainId: '0409', subId: 'a', name: '서울홍성교회 (Seoul HongSeng)', location: '서울 서대문구 홍제3동 서울홍성교회' },
    { mainId: '0411', subId: 'a', name: '순천주성교회 (Jusung)', location: '전남 순천시 해룡면 복성길 21' },
    { mainId: '0412', subId: 'a', name: '처음사랑교회 (firstlovechurch)', location: '서울 강서구 내발산동 723-10 지하1층' },
    { mainId: '0413', subId: 'a', name: '내일교 (NAEIL PRESBYTERIAN CHURCH)', location: '대구 달서구 성서동로 212' },
    { mainId: '0415', subId: 'a', name: '김제새순교회 (gimje saesoon church)', location: '전북 김제시 요촌동 김제새순교회' },
    { mainId: '0416', subId: 'a', name: '새중앙교회 (SAEJUNGANG CHURCH)', location: '경기 안양시 동안구 귀인로 301 새중앙교회 어와나' },
    { mainId: '0417', subId: 'a', name: '충일교회 (Chungil)', location: '충북 충주시 샘골길 10 충일교회' },
    { mainId: '0422', subId: 'a', name: '사랑과은혜교회 (LOVE & GRACE CHURCH)', location: '경기 성남시 분당구 느티로 2 AK와이즈플레이스 B1' },
    { mainId: '0423', subId: 'a', name: '생명의빛교회 (Light of heaven church)', location: '전북 전주시 완산구 평화동1가 296 번지' },
    { mainId: '0425', subId: 'a', name: '기쁨의교회 (The Joyful Church)', location: '경북 포항시 북구 삼흥로 411' },
    { mainId: '0426', subId: 'a', name: '전주중부교회 (JeonJu JungBu Church)', location: '전북특별자치도 전주시 완산구 전주객사4길 23-8 전주중부교회' },
    { mainId: '0427', subId: 'a', name: '천안성결교회 (Cheonan Evangelical Holiness Church)', location: '충남 천안시 동남구 중앙로 196' },
    { mainId: '0428', subId: 'a', name: '하늘꿈연동교회 (Hdydpc)', location: '경기 수원시 장안구 서부로2198번길 11' },
    { mainId: '0429', subId: 'a', name: '호산나교회 (Hosanna Methodist Church)', location: '서울 금천구 독산1동 151-5' },
    { mainId: '0430', subId: 'a', name: '온누리교회 수원캠퍼스 (수원 온누리교회) (onnuri suwon)', location: '경기 용인시 기흥구 기흥로 58-1 기흥 ICT밸리 C동 207호' },
    { mainId: '0432', subId: 'a', name: '방주교회 (Bangju Church)', location: '서울 서초구 방배천로24길 8 방주교회' },
    { mainId: '0435', subId: 'a', name: '만민교회 (MANMIN Presbyterian Church)', location: '대구 달서구 본동 758 만민교회' },
    { mainId: '0436', subId: 'a', name: '서문로교회 (seonoonro presbyterian church)', location: '대구 중구 서내동 서성로 16길 21' },
    { mainId: '0439', subId: 'a', name: '목양교회(구리) (Mokyang Prebyterian Church)', location: '경기 구리시 장자호수길 67 목양교회' },
    { mainId: '0445', subId: 'a', name: '신천교회 (shincheon church)', location: '서울 송파구 석촌호수로 102 (잠실동, 신천비전센타) 3층 어와나' },
    { mainId: '0447', subId: 'a', name: '수유동교회 (suyudong church)', location: '서울 강북구 수유2동 700-10' },
    { mainId: '0455', subId: 'a', name: '이리성산교회 (Iri Seong San)', location: '전북특별자치도 익산시 평동로11길 44 이리성산교회' },
    { mainId: '0457', subId: 'a', name: '대전영락교회 (Daejeon youngrak church)', location: '대전 대덕구 아리랑로197번길 33 대전영락교회 사무실(키드림스쿨) Awana' },
    { mainId: '0458', subId: 'a', name: '대전중앙교회 (Daejeon central church)', location: '대전 중구 계룡로 942 대전중앙교회' },
    { mainId: '0462', subId: 'a', name: '동촌교회 (Dong-Chon Church)', location: '대구 동구 방촌동 1070-18' },
    { mainId: '0463', subId: 'a', name: '여의도순복음송파교회 (Yoido Full Gospel Songpa Church)', location: '서울 송파구 방이동 209-1' },
    { mainId: '0467', subId: 'a', name: '예수향남교회 (Jesushyangmanchurch)', location: '경기 화성시 향남읍 서봉로 117' },
    { mainId: '0468', subId: 'a', name: '일산충정교회 (ChoongJung Church)', location: '경기 고양시 일산동구 일산로 244 충정교회' },
    { mainId: '0469', subId: 'a', name: '참된교회 (Chamdoen)', location: '경기 부천시 소사구 중동로49번길 35' },
    { mainId: '0470', subId: 'a', name: '소명교회 (Somyung)', location: '부산 해운대구 좌동순환로468번가길 87' },
    { mainId: '0471', subId: 'a', name: '온양제일교회 (Onyang Jeil Church)', location: '충남 아산시 모종북로 17 온양제일교회' },
    { mainId: '0472', subId: 'a', name: '보배로운교회 (boberoun)', location: '경기 수원시 영통구 영통로501번길 1-7' },
    { mainId: '0473', subId: 'a', name: '공군오산기지교회 (Osan Airbase Church)', location: '경기 평택시 신장로 55 공군오산기지교회' },
    { mainId: '0476', subId: 'a', name: '순복음범천교회 (Full Gospel Beom Cheon Church)', location: '부산 부산진구 엄광로 359 순복음범천교회' },
    { mainId: '0480', subId: 'a', name: '말레이시아 열린연합(480) (open union)', location: '경기 수원시 팔달구 수성로244번길 25 103동 1004호' },
    { mainId: '0484', subId: 'a', name: '용인제일교회 (YONGIN LEADING CHURCH)', location: '경기 용인시 처인구 중부대로1262번길 68 용인제일교회글로리센터' },
    { mainId: '0485', subId: 'a', name: '중부명성교회 (JUNGBUMYONGSUNGCHURCH)', location: '충북 청주시 서원구 용평로113번길 11 (분평동 619번지)' },
    { mainId: '0486', subId: 'a', name: '광주사랑의교회 (GwangJu SaRang Community Church)', location: '경기 광주시 광주대로 115 (송정동)' },
    { mainId: '0488', subId: 'a', name: '충주남부감리교회 (chungju nambu methodlst church)', location: '충북 충주시 금봉4길 30 (용산동, 남부감리교회) 충주남부감리교회' },
    { mainId: '0497', subId: 'a', name: '새로남감리교회 (New Birth)', location: '서울 서초구 양재동 264-11 지층' },
    { mainId: '0499', subId: 'a', name: '한누리교회 (Hanuury)', location: '부산 해운대구 선수촌로207번가길 42 (반여동, 한누리교회) 반여동, 한누리교' },
    { mainId: '0504', subId: 'a', name: '수원 온사랑교회 (Onsarang church)', location: '경기 수원시 권선구 동수원로242번길 5-12 온사랑교회' },
    { mainId: '0506', subId: 'a', name: '더사랑의교회 (Thesarang )', location: '경기 수원시 영통구 광교중앙로 260 더사랑의교회' },
    { mainId: '0507', subId: 'a', name: '더라이프지구촌교회 (TheLifeGlobalChurch)', location: '경기 용인시 기흥구 흥덕2로 85 우연프라자 7층 더라이프지구촌교회' },
    { mainId: '0508', subId: 'a', name: '죽전지구촌교회 (JUKJEON GLOBAL MISSION CHURCH)', location: '경기 용인시 기흥구 보정동 1208-2 7층 죽전지구촌교회 사무실' },
    { mainId: '0509', subId: 'a', name: '마산삼일교회 (Masan Samil Presbyterian Church)', location: '경남 창원시 마산회원구 산호천서길 237 마산삼일교회' },
    { mainId: '0511', subId: 'a', name: '동백동산교회 (dongbaekdongsan)', location: '경기 용인시 기흥구 평촌1로2번길 5 동백동산교회' },
    { mainId: '0516', subId: 'a', name: '애지헌교회 (Sejong AeJiHun)', location: '서울 광진구 능동로 209 (군자동, 세종대학교) 애지헌교회' },
    { mainId: '0519', subId: 'a', name: '철원만나감리교회 (CHEORWON MANNA METHODIST CHURCH)', location: '강원특별자치도 철원군 갈말읍 명성로139번길 17 2층 사무실' },
    { mainId: '0523', subId: 'a', name: '울산매곡교회 (Ulsan Maegok church)', location: '울산 북구 매곡본길 52 울산매곡교회' },
    { mainId: '0524', subId: 'a', name: '수원서부교회 (suwon seobu church)', location: '경기 수원시 장안구 경수대로 748' },
    { mainId: '0525', subId: 'a', name: '동홍천교회 (DongHongcheon Church)', location: '강원특별자치도 홍천군 화촌면 구룡령로 214-13 동홍천교회' },
    { mainId: '0527', subId: 'a', name: '온누리소망교회 (ONNURISOMANG)', location: '인천 서구 청라커낼로 229' },
    { mainId: '0528', subId: 'a', name: '기장교회 (Gijang Church)', location: '부산 기장군 기장읍 차성동로 58 (기장교회)' },
    { mainId: '0529', subId: 'a', name: '분당한소망교회 (Great Vision Church)', location: '경기 용인시 수지구 용구대로 2737-9 지하2층' },
    { mainId: '0534', subId: 'a', name: '대구동신교회 (Daegu Dongshin Church)', location: '대구 수성구 교학로4길 39 대구동신교회' },
    { mainId: '0535', subId: 'a', name: '달서 (Dalseo)', location: '대구 서구 국채보상로 342' },
    { mainId: '0540', subId: 'a', name: '광주은광교회 (Gwangju Eungwang)', location: '광주 광산구 수완로 118' },
    { mainId: '0541', subId: 'a', name: '일산광림교회 (ILSANKWANGLIM)', location: '경기 고양시 일산동구 숲속마을로 83 일산광림교회' },
    { mainId: '0544', subId: 'a', name: '대구부광교회 (bookwang)', location: '대구 북구 칠곡중앙대로52길 38 대구부광교회' },
    { mainId: '0548', subId: 'a', name: '울산흰돌교회 (ULSAN WHITE STONE CHURCH)', location: '울산 동구 월봉6가길 3 울산흰돌교회' },
    { mainId: '0553', subId: 'a', name: '대구동신교회영어어와나(EM) (Daegu Dongshin Church)', location: '대구 수성구 교학로4길 39 대구동신교회' },
    { mainId: '0555', subId: 'a', name: '신도교회 (SHINDO PRESBYTERIAN CHURCH)', location: '서울 구로구 구일로2길 45 (구로동, 신도교회) 신도교회' },
    { mainId: '0559', subId: 'a', name: '대원교회 (Daewon kmc)', location: '경기 성남시 중원구 희망로 365 대원교회 교육부' },
    { mainId: '0568', subId: 'a', name: '청주 중앙교회 (Cheongju Central Church)', location: '충북 청주시 흥덕구 가로수로1086번길 16 (비하동) 청주중앙교회' },
    { mainId: '0575', subId: 'a', name: '계룡장로교회 (Kyeryong Presbyterian Church)', location: '충남 계룡시 엄사면 엄사중앙로 38-3' },
    { mainId: '0577', subId: 'a', name: '사직동교회 (SAJIKDONG CHURCH)', location: '부산 동래구 사직북로34번길 59 사직동교회' },
    { mainId: '0578', subId: 'a', name: '목포사랑의교회 (MOKPOSARANG CHURCH)', location: '전남 목포시 복산길6번길 7 목포사랑의교회' },
    { mainId: '0580', subId: 'a', name: '산본양문교회 (SANBON YANGMOON)', location: '경기 군포시 송부로 264' },
    { mainId: '0581', subId: 'a', name: '안양제일교회 (Anyangjeil Church)', location: '경기 안양시 만안구 장내로140번길 11-10 안양제일교회' },
    { mainId: '0582', subId: 'a', name: '영화교회 (YOUNGHWAH)', location: '경기 수원시 장안구 덕영대로639번길 43' },
    { mainId: '0583', subId: 'a', name: '부평화랑교회 (Bupyeonghwarang)', location: '인천 부평구 화랑로 73 부평화랑교회' },
    { mainId: '0584', subId: 'a', name: '호산나교회 (HOSANNA CHURCH)', location: '부산 강서구 명지오션시티6로 2 호산나교회' },
    { mainId: '0590', subId: 'a', name: '청주상당교회 (Sangdang)', location: '충북 청주시 서원구 청남로 1851 상당교회' },
    { mainId: '0591', subId: 'a', name: '성만교회 (Seongman Church)', location: '전남 나주시 산포면 등정덕례길 136-7 성만교회' },
    { mainId: '0592', subId: 'a', name: '땅끝교회 (Ttangkkeut church)', location: '부산 영도구 대교로 50' },
    { mainId: '0593', subId: 'a', name: '영암교회 (youngarm)', location: '서울 영등포구 신길로60다길 10' },
    { mainId: '0594', subId: 'a', name: '시온샘교회 (Sionseam)', location: '전북특별자치도 전주시 완산구 신봉로 72 2층 205호' },
    { mainId: '0595', subId: 'a', name: '물금교회 (MULGEUM PRESBYTERIAN CHURCH)', location: '경남 양산시 물금읍 가촌서8길 35 물금교회' },
    { mainId: '0596', subId: 'a', name: '더원사랑의교회 (Theonesarangchurch)', location: '경기 용인시 기흥구 서천로202번길 7-2 드림갤럭시타워 5층 더원사랑의교회' },
    { mainId: '0597', subId: 'a', name: '수원소망교회 (Suwon Somang presbyterian church)', location: '경기 수원시 권선구 동탄원천로 854 소망교회' },
    { mainId: '0598', subId: 'a', name: '수원영광교회 (Suwon Glory Church )', location: '경기 수원시 팔달구 동말로47번길 42 수원영광교회' },
    { mainId: '0599', subId: 'a', name: '팔복 (PALBOK)', location: '인천 미추홀구 수봉남로6번길 74 팔복교회' },
    { mainId: '0610', subId: 'a', name: '성동교회 (SeongDong Presbyterian Church (SDPC))', location: '부산 남구 남동천로 62 성동교회' },
    { mainId: '0612', subId: 'a', name: '중문교회 (JOONGMOON CHURCH)', location: '대전 서구 도산로431번길 21 중문교회' },
    { mainId: '0616', subId: 'a', name: '성내동교회 (Seong Nae Dong Presbyterian Church)', location: '서울 강동구 풍성로35길 53 성내동교회' },
    { mainId: '0617', subId: 'a', name: '양지온누리교회 (Yangi Onnuri Church)', location: '경기 용인시 처인구 양지면 추계로 62 양지 온누리 교회' },
    { mainId: '0619', subId: 'a', name: '세연중앙교회 (SeiYonCentralBaptistChurch)', location: '대전 대덕구 동춘당로3번길 2 세연중앙교회' },
    { mainId: '0622', subId: 'a', name: '부산 성안교회 (seongan)', location: '부산 부산진구 가야대로507번길 148' },
    { mainId: '0624', subId: 'a', name: '원주양문교회 (sheepgate)', location: '강원특별자치도 원주시 소방서길 40-4 양문교회' },
    { mainId: '0625', subId: 'a', name: '목포복음교회 (mogpogaspel)', location: '전남 목포시 동명로86번길 10 목포복음교회' },
    { mainId: '0626', subId: 'a', name: '서울양문교회 (yangmoon)', location: '서울 동작구 시흥대로 644-1' },
    { mainId: '0627', subId: 'a', name: '안동동부교회 (ANDONG DONGBU Presbyterian Church)', location: '경북 안동시 강변마을1길 21-1 101' },
    { mainId: '0629', subId: 'a', name: '시흥제일교회 (SIHEUNGCHEIL CHURCH)', location: '경기 시흥시 복지로91번길 10-4 시흥제일교회' },
    { mainId: '0633', subId: 'a', name: '로뎀교회 (RODEM CHURCH)', location: '서울 강서구 양천로24길 31 로겜교회' },
    { mainId: '0644', subId: 'a', name: '하나숲동산교회 (hanasupdongsanchurch)', location: '경기 화성시 남양읍 남양로931번길 14-33 하나숲동산교회' },
    { mainId: '0645', subId: 'a', name: '신갈중앙교회 (SINGAL JOONG-ANG CHURCH)', location: '경기 용인시 기흥구 백남준로 28-3 신갈중앙교회' },
    { mainId: '0647', subId: 'a', name: '목민교회 (MOKMIN CHURCH)', location: '서울 양천구 중앙로45길 13' },
    { mainId: '0648', subId: 'a', name: '드림교회 (DREAM CHURCH)', location: '경기 평택시 고덕국제2로 4 드림교회' },
    { mainId: '0649', subId: 'a', name: '명석교회 (Myungsuk Methodist Church)', location: '경기 수원시 영통구 영통로153번길 74-5' },
    { mainId: '0661', subId: 'a', name: '한밭제일장로교회 (HANBATJEIL PRESBYTERIAN CHURCH)', location: '대전 유성구 원내동 31' },
    { mainId: '0662', subId: 'a', name: '부천복된교회 (Bokdoen church)', location: '경기 부천시 원미구 원미동 133-3' },
    { mainId: '0665', subId: 'a', name: '육해공군본부교회 (Army, Navy and Air Force Headquarters Church)', location: '충남 계룡시 신도안면 신도안2길 95' },
    { mainId: '0668', subId: 'a', name: '바울교회 (paulchurch)', location: '전북특별자치도 전주시 완산구 유기전1길 6-31 바울교회' },
    { mainId: '0669', subId: 'a', name: '온천교회 (onchun church)', location: '부산 동래구 금강로73번길 5' },
    { mainId: '0673', subId: 'a', name: '광림남교회 (KWANGLIM NAM CHURCH)', location: '경기 용인시 기흥구 동백죽전대로 245 광림남교회' },
    { mainId: '0675', subId: 'a', name: '목감신일교회 (mokgamshinil)', location: '경기 시흥시 목감남서로 9-27' },
    { mainId: '0679', subId: 'a', name: '염광교회 (yeomkwang)', location: '경남 거제시 탑곡로 69 염광교회' },
    { mainId: '0687', subId: 'a', name: '송탄제일교회 (songtan jeil church)', location: '경기 평택시 신서로 27-7' },
    { mainId: '0696', subId: 'a', name: '충현 (Choonghyun)', location: '서울 강남구 테헤란로27길 40 충현교회' },
    { mainId: '0701', subId: 'a', name: '강북중앙침례교회 (kangbukjoongangbaptistchurch)', location: '서울 도봉구 덕릉로 381 강북중앙침례교회' },
    { mainId: '0706', subId: 'a', name: '성덕중앙교회 (SeongDeok JungAng Church)', location: '서울 노원구 섬밭로 299 (중계동, 서울아이티고등학교) 믿음관 2층 사무실' },
    { mainId: '0709', subId: 'a', name: '계산성화교회 (GYESANSEONGHWA)', location: '대전 유성구 학하남로19번길 22-7 계산성화교회' },
    { mainId: '0715', subId: 'a', name: '청암교회 (CHEONGAM CHURCH )', location: '서울 용산구 효창원로86라길 13 청암교회' },
    { mainId: '0716', subId: 'a', name: '동신교회 (DONG SHIN PRESBYTERIAN CHURCH)', location: '서울 종로구 종로44길 43 동신교회' },
    { mainId: '0718', subId: 'a', name: '호평제일교회 (hopyeong first presbyterian church)', location: '경기 남양주시 호평로 49' },
    { mainId: '0723', subId: 'a', name: '원주중앙성결교회 (WONJU CENTRAL EVANGELICAL HOLINESS CHURCH)', location: '강원특별자치도 원주시 영랑길 73' },
    { mainId: '0724', subId: 'a', name: '남성교회 (nam sung)', location: '부산 영도구 남항로9번길 33' },
    { mainId: '0725', subId: 'a', name: '영주제일교회 (YEONGJU FIRST PRESBYTERIAN CHURCH)', location: '경북 영주시 광복로 37' },
    { mainId: '0726', subId: 'a', name: '천안침례교회 (Cheonan Baptist Church)', location: '충남 천안시 동남구 원거리13길 30 침례교회' },
    { mainId: '0730', subId: 'a', name: '제자광성교회 (Jejakwangsung Church)', location: '경기 고양시 일산동구 하늘마을1로 72' },
    { mainId: '0731', subId: 'a', name: '등촌교회 (Deungchon Church)', location: '서울 양천구 목동중앙북로8길 49' },
    { mainId: '0733', subId: 'a', name: '아현교회현교회 (Ahyun)', location: '서울 마포구 신촌로 212 1층 교역자실 Awana' },
    { mainId: '0734', subId: 'a', name: '대구성명교회 (sungmyung)', location: '대구 달서구 새방로 61' },
    { mainId: '0735', subId: 'a', name: '더온누리교회 (THEONNURI CHURCH)', location: '전북특별자치도 전주시 덕진구 만성동로 84-9 더온누리교회' },
    { mainId: '0737', subId: 'a', name: '더자람교회 (Thejaram church)', location: '부산 서구 남부민로40번길 15 더자람교회' },
    { mainId: '0743', subId: 'a', name: '광주중흥 (Gwangju jungheung)', location: '광주 북구 향토문화로2번길 8' },
    { mainId: '0745', subId: 'a', name: '명동교회 (MYEONGDONG)', location: '서울 서초구 서초중앙로29길 28 명동교회' },
    { mainId: '0747', subId: 'a', name: '울산한마음 (Hanmaeum)', location: '울산 동구 문재6길 5-5' },
    { mainId: '0748', subId: 'a', name: '석관중앙교회 (Seokgwan Center Church)', location: '서울 성북구 돌곶이로14길 34 석관중앙교회' },
    { mainId: '0750', subId: 'a', name: '이음학교 (유아) (eum christian school)', location: '경기 수원시 영통구 광교중앙로248번길 7-7 2층 이음유아학교' },
    { mainId: '0751', subId: 'a', name: '안성제일장로교회 (ansungjeiljanglo)', location: '경기 안성시 중앙로 271' },
    { mainId: '0753', subId: 'a', name: '청지기교회 (CHUNGJIGI Presbyterian Church)', location: '경기 양주시 옥정로 151 힐링프라자 202호 청지기교회' },
    { mainId: '0754', subId: 'a', name: '양평동교회 (Yangpyeong-dong Church)', location: '서울 영등포구 양평로20길 7' },
    { mainId: '0757', subId: 'a', name: '동광교회 (Dong-kwang presbyterian church)', location: '서울 동작구 성대로1길 26 상도동, 동광교회' },
    { mainId: '0759', subId: 'a', name: '은성교회 (EunSung Church)', location: '경기 남양주시 오남읍 진건오남로884번길 16 1층 사무실' },
    { mainId: '0760', subId: 'a', name: '새한교회 (Saehan Presbyterian Church)', location: '서울 송파구 도곡로62길 21 새한교회' },
    { mainId: '0761', subId: 'a', name: '신길교회 (Shingil Waymakers Church)', location: '서울 영등포구 영등포로67가길 9 신길교회' },
    { mainId: '0763', subId: 'a', name: '청주서남교회 (seonam)', location: '충북 청주시 서원구 서부로 1371 청주서남교회' },
    { mainId: '0765', subId: 'a', name: '수지예본교회 (SUJI YEBON CHURCH)', location: '경기 용인시 수지구 동천로 226 수지예본교회' },
    { mainId: '0766', subId: 'a', name: '사천 (Sacheon)', location: '경남 사천시 사천읍 평화2길 60 사무실' },
    { mainId: '0768', subId: 'a', name: '일신감리교회 (ilshin)', location: '서울 중구 퇴계로6길 36 선교관 2층 사무실' },
    { mainId: '0772', subId: 'a', name: '송탄중앙침례교회 (songtan central batist church)', location: '경기 평택시 탄현로368번길 25' },
    { mainId: '0773', subId: 'a', name: '세종늘사랑교회 (Sejongeverlovechurch)', location: '세종특별자치시 대평로 83 6층' },
    { mainId: '0775', subId: 'a', name: '수원명성교회 (SU WON MYEONG)', location: '경기 수원시 권선구 세권로43번길 48-11 수원명성교회' },
    { mainId: '0776', subId: 'a', name: '아름빛교회 (btflightchurch)', location: '경기 용인시 기흥구 동백5로 22 동백문월드 A동 3층 아름빛교회' },
    { mainId: '0777', subId: 'a', name: '흥해침롁교회 (HungHae Baptist Church)', location: '경북 포항시 북구 흥해읍 중성로 82' },
    { mainId: '0779', subId: 'a', name: '효성 (HYO SUNG)', location: '충북 충주시 응골1길 21' },
    { mainId: '0781', subId: 'a', name: '이음교회 (EEUM CHURCH)', location: '경기 성남시 분당구 판교대장로7길 87 4층 어린이부서실' },
    { mainId: '0782', subId: 'a', name: '부림교회 (BU-RIM PRESBYTERIAN CHURCH)', location: '경북 경산시 진량읍 부기길5길 10-10' },
    { mainId: '0783', subId: 'a', name: '창일교회 (changil church)', location: '서울 양천구 신정로 273-3' },
    { mainId: '0784', subId: 'a', name: '주와함께교회 (everyday with him)', location: '경기 광주시 문형동 561-5 3,4층' },
    { mainId: '0785', subId: 'a', name: '순복음원당교회 (Full gospel wondang church)', location: '경기 고양시 덕양구 화신로 255 어와나' },
    { mainId: '0786', subId: 'a', name: '안양교회 (anyang)', location: '경기 안양시 동안구 동편로49번길 24 안양교회' },
    { mainId: '0787', subId: 'a', name: '김천서부교회 (Gimcheon Seobu Church)', location: '경북 김천시 문화3길 8' },
    { mainId: '0791', subId: 'a', name: '청주 복대교회 (Cheong-ju Bokdae church)', location: '충북 청주시 흥덕구 산단로28번길 17 청주 복대교회' },
    { mainId: '0793', subId: 'a', name: '서문교회 (SEOMOON CHURCH)', location: '서울 은평구 가좌로10길 10' },
    { mainId: '0795', subId: 'a', name: '남성교회 (nschurch)', location: '대구 서구 서대구로 171 1층' },
    { mainId: '0796', subId: 'a', name: '여수새중앙교회 (YeosuSaejungang)', location: '전남 여수시 좌수영로 493-5' },
    { mainId: '0797', subId: 'a', name: '율하교회 (yulha )', location: '대구 동구 각산동 1082-3 신성빌딩 6층 사무실' },
    { mainId: '0798', subId: 'a', name: '구미제일교회 (gumijeil church)', location: '경북 구미시 산동읍 신당4로 26 구미제일교회' },
    { mainId: '0799', subId: 'a', name: '수유제일교회 (sooyoujeil church)', location: '서울 종로구 대학로3길 29 총회창립100주년기념관 신관 802호 수유제일교회' },
    { mainId: '0800', subId: 'a', name: '동산교회 (dongsan)', location: '대구 동구 동부로5길 31' },
    { mainId: '0801', subId: 'a', name: '판교소망교회 (PANGYO-SOMANG)', location: '경기 성남시 분당구 동판교로 142 판교소망교회' },
    { mainId: '0802', subId: 'a', name: '이름다운우리선교회 (Ourbeautifulchurch)', location: '경기 고양시 일산동구 성현로 537' },
    { mainId: '0803', subId: 'a', name: '남현교회 (Namhyun Church)', location: '서울 구로구 경인로 346' },
    { mainId: '0804', subId: 'a', name: '수지함께하는교회 (SUJI WITH CHURCH)', location: '경기 용인시 수지구 신봉1로 114 대흥빌딩 1,3,4층' },
    { mainId: '0805', subId: 'a', name: '한울교회 (The HANWOOL Presbyterian Church)', location: '경기 성남시 분당구 운중로 90 한울교회' },
    { mainId: '0806', subId: 'a', name: '성민교회 (SUNGMIN)', location: '서울 서초구 효령로 110' },
    { mainId: '0808', subId: 'a', name: '한영교회 (HANYOUNG PRESBYTERIAN CHURCH)', location: '서울 영등포구 영중로41길 5' },
    { mainId: '0809', subId: 'a', name: '일산 주님의 교회 (Ilsan Lords Church)', location: '경기 고양시 일산서구 탄현로 42 홀트학교 내 주님의 교회' },
    { mainId: '0813', subId: 'a', name: '영동제일교회 (Yeongdong First Church)', location: '서울 강남구 학동로6길 31 영동제일교회 1층 교역자 사무실' },
    { mainId: '0814', subId: 'a', name: '이어진 교회 (IEOJIN CHURCH)', location: '경기 용인시 기흥구 마북로 184' },
    { mainId: '0815', subId: 'a', name: '연동교회 (Youndong)', location: '서울 종로구 김상옥로 37' },
    { mainId: '0816', subId: 'a', name: '수원평안교회 (Peace Church)', location: '경기 수원시 권선구 호매실로218번길 110' },
    { mainId: '0817', subId: 'a', name: '함께꿈꾸는교회 (dreaming together church)', location: '경기 용인시 기흥구 신갈로 52 동인빌딩 3층 함께꿈꾸는교회' },
    { mainId: '0821', subId: 'a', name: '온누리교회 강동 (ONNURI Church Gangdong)', location: '서울 강동구 천호대로157길 14 나비빌딩 11층' },
    { mainId: '0822', subId: 'a', name: '인천공항교회 (Incheon Airport Methodist Church)', location: '인천 중구 신도시북로 74' },
    { mainId: '0823', subId: 'a', name: '예수순전한교회 (Yeshua Mere Church)', location: '서울 서초구 강남대로6길 90-23 지하 1층' },
    { mainId: '0824', subId: 'a', name: '부산생명수교회 (LIVING WATER CHURCH)', location: '부산 금정구 중앙대로 2000-11' },
    { mainId: '0826', subId: 'a', name: '신광교회 (Shingwang Church)', location: '경기 의정부시 의정로 162' },
    { mainId: '0827', subId: 'a', name: '성서중부교회 (SEONGSEOJUNGBUGYOHOE)', location: '대구 달서구 이곡서로5길 10 성서중부교회' },
    { mainId: '0829', subId: 'a', name: '인천동산교회 (INCHEON DONGSAN METHODIST CHURCH)', location: '인천 남동구 인수로32번길 4-3 인천동산교회 1층' },
    { mainId: '0831', subId: 'a', name: '동진주교회 (Dongjinju Church)', location: '경남 진주시 도동천로 69' },
    { mainId: '0832', subId: 'a', name: '익산영생교회 (ETERNAL LIFE CHURCH)', location: '전북특별자치도 익산시 무왕로 1175-1 영생감리교회' },
    { mainId: '0833', subId: 'a', name: '부천성수교회 (Bucheon Seongsu Church)', location: '경기 부천시 원미구 부일로 612 부천성수교회' },
    { mainId: '0834', subId: 'a', name: '인천선린교회 (sunlin church)', location: '인천 부평구 열우물로 134 선린감리교회' },
    { mainId: '0835', subId: 'a', name: '평택대광교회 (PYEONGTAEK DAEKWANG PRESBYTERIAN CHURCH)', location: '경기 평택시 만세로 1854' },
    { mainId: '0837', subId: 'a', name: '은평제일교회 (EunPyung First Church)', location: '서울 은평구 진관3로 46 유초등부' },
    { mainId: '0838', subId: 'a', name: '공군대구기지교회 (ROK Air Force Church)', location: '대구 동구 아양로 352 공군대구기지교회' },
    { mainId: '0839', subId: 'a', name: '동탄제자로교회 (Dongtan jejaro church)', location: '경기 화성시 동탄신리천로 278 리더스뷰 프라자 3층' },
    { mainId: '0840', subId: 'a', name: '산정현교회 (sanjyunghyun church)', location: '전남 여수시 신월로 601' },
    { mainId: '0842', subId: 'a', name: '대전대흥침례교회 (Daeheung Baptist Church)', location: '대전 중구 계룡로816번길 19 대전대흥침례교회' },
    { mainId: '0843', subId: 'a', name: '강남선한목자교회 (Gangnam good shepher methodist church)', location: '서울 강남구 헌릉로 569 강남리더스프라자8층' },
    { mainId: '0844', subId: 'a', name: '여명 교회 (Yeomyung church)', location: '충남 천안시 동남구 수곡1길 12-1 여명 교회' },
    { mainId: '0846', subId: 'a', name: '금란교회 (kumnan methodist church)', location: '서울 중랑구 망우로 455 금란교회' },
    { mainId: '0848', subId: 'a', name: '도동교회 (dodong presbyterian church)', location: '경남 진주시 모덕로163번길 15-3' },
    { mainId: '0849', subId: 'a', name: '화성교회 (Hwasung church)', location: '서울 강서구 까치산로 66 2층' },
    { mainId: '0850', subId: 'a', name: '새밝교회 (saeparkchurch)', location: '광주 서구 쌍촌로65번길 10 새밝교회' },
    { mainId: '0851', subId: 'a', name: '청주미평교회 (CHEONG JU MIPYEONG)', location: '충북 청주시 서원구 청남로 1891 청주미평교회' },
    { mainId: '0852', subId: 'a', name: '(송파)수동교회 (SOODONG)', location: '서울 송파구 가락로33길 3 수동교회' },
    { mainId: '0854', subId: 'a', name: '더행복한교회 (The happy chuch)', location: '경기 안산시 단원구 원포공원2로 35 4층 401호' },
    { mainId: '0856', subId: 'a', name: '신평로교회 (Sinpyeongro church)', location: '부산 사하구 다대로 73 신평로교회' },
    { mainId: '0857', subId: 'a', name: '산곡교회 (SANGOK)', location: '인천 부평구 부영로 199 산곡교회' },
    { mainId: '0858', subId: 'a', name: '더THE사랑교회 (THETHESARANG)', location: '경기 성남시 분당구 구미로9번길 25 2층' },
    { mainId: '0860', subId: 'a', name: '보라매교회 (BORAMAE)', location: '서울 동작구 여의대방로10가길 22 보라매교회' },
    { mainId: '0861', subId: 'a', name: '채움과비움의교혹 (chaebi)', location: '전북특별자치도 전주시 완산구 서원로 399 신흥중고등학교 스미스홀' },
    { mainId: '0862', subId: 'a', name: '청주호산나교회 (ho san na church)', location: '충북 청주시 흥덕구 강내면 탑연1길 8 신성미소지움 104동 503호' },
    { mainId: '0863', subId: 'a', name: '서울반석교회 (Seoul Bansuk Presbyterian Church)', location: '경기 광명시 시청로29번길 8-19' },
    { mainId: '0865', subId: 'a', name: '명지대학교교회 (MYONGJI UNIVERSITY CHURCH)', location: '서울 서대문구 가좌로 117 2층 교역자실' },
    { mainId: '0866', subId: 'a', name: '세종송담교회 (Sejong Songdam)', location: '세종특별자치시 달빛1로 125 세종송담교회' },
    { mainId: '0867', subId: 'a', name: '더주님의교회 (The JUNIM Church)', location: '경기 수원시 영통구 영통로 100 4층 더주님의교회' },
    { mainId: '0868', subId: 'a', name: '신창동교회 (SHINCHANGDONG CHURCH)', location: '서울 도봉구 우이천로4길 20 ( 창3동 505-7)' },
    { mainId: '0869', subId: 'a', name: '늘사랑 (nulsarang)', location: '경기 안양시 동안구 경수대로 898 9' },
    { mainId: '0871', subId: 'a', name: '서현교회 (seohyun)', location: '서울 서대문구 북아현로14길 57 서현교회' },
    { mainId: '0873', subId: 'a', name: '대구중앙침례교회 (DAEGU CENTRAL BAPTIST CHURCH)', location: '대구 북구 대현남로5길 20 대구중앙침례교회' },
    { mainId: '0874', subId: 'a', name: '온누리교회 (ONNURI CHURCH)', location: '서울 용산구 이촌로 347-11 온누리교회' },
    { mainId: '0876', subId: 'a', name: '세종중문교회 (SejongJoongmoonchurch)', location: '세종특별자치시 금남구즉로 225 세종중문교회' },
    { mainId: '0879', subId: 'a', name: '제일신마산교회 (j1sms)', location: '경남 창원시 마산합포구 문화북2길 38 1층 사무실' },
    { mainId: '0880', subId: 'a', name: '부산새날교회 (NEWDAY CHURCH)', location: '부산 강서구 공항로1309번길 140-7 새날교회' },
    { mainId: '0884', subId: 'a', name: '열방교회 (ALL NATIONS CHURCH)', location: '서울 양천구 신정로13길 11' }
];

// 샘플 이벤트 데이터
const sampleEvents: ISampleEvent[] = [
  {
    sampleEvent_ID: 1,
    sampleEvent_Name: "성경퀴즈대회",
    sampleEvent_Location: "미정",
    sampleEvent_Year: "미정",
    sampleEvent_Start_Date: null,
    sampleEvent_End_Date: null,
    sampleEvent_Registration_Start_Date: null,
    sampleEvent_Registration_End_Date: null,
    sampleEvent_Open_Available: "비공개",
    sampleEvent_Place: "미정",
    sampleEvent_Month: "1월"
  },
  {
    sampleEvent_ID: 2,
    sampleEvent_Name: "YM Summit",
    sampleEvent_Location: "미정",
    sampleEvent_Year: "미정",
    sampleEvent_Start_Date: null,
    sampleEvent_End_Date: null,
    sampleEvent_Registration_Start_Date: null,
    sampleEvent_Registration_End_Date: null,
    sampleEvent_Open_Available: "비공개",
    sampleEvent_Place: "미정",
    sampleEvent_Month: "1월"
  },
  {
    sampleEvent_ID: 3,
    sampleEvent_Name: "상반기 연합 BT",
    sampleEvent_Location: "미정",
    sampleEvent_Year: "미정",
    sampleEvent_Start_Date: null,
    sampleEvent_End_Date: null,
    sampleEvent_Registration_Start_Date: null,
    sampleEvent_Registration_End_Date: null,
    sampleEvent_Open_Available: "비공개",
    sampleEvent_Place: "미정",
    sampleEvent_Month: "2월"
  },
  {
    sampleEvent_ID: 4,
    sampleEvent_Name: "컨퍼런스",
    sampleEvent_Location: "미정",
    sampleEvent_Year: "미정",
    sampleEvent_Start_Date: null,
    sampleEvent_End_Date: null,
    sampleEvent_Registration_Start_Date: null,
    sampleEvent_Registration_End_Date: null,
    sampleEvent_Open_Available: "비공개",
    sampleEvent_Place: "미정",
    sampleEvent_Month: "3월"
  },
  {
    sampleEvent_ID: 5,
    sampleEvent_Name: "올림픽 설명회",
    sampleEvent_Location: "미정",
    sampleEvent_Year: "미정",
    sampleEvent_Start_Date: null,
    sampleEvent_End_Date: null,
    sampleEvent_Registration_Start_Date: null,
    sampleEvent_Registration_End_Date: null,
    sampleEvent_Open_Available: "비공개",
    sampleEvent_Place: "미정",
    sampleEvent_Month: "4월"
  },
  {
    sampleEvent_ID: 6,
    sampleEvent_Name: "올림픽",
    sampleEvent_Location: "미정",
    sampleEvent_Year: "미정",
    sampleEvent_Start_Date: null,
    sampleEvent_End_Date: null,
    sampleEvent_Registration_Start_Date: null,
    sampleEvent_Registration_End_Date: null,
    sampleEvent_Open_Available: "비공개",
    sampleEvent_Place: "미정",
    sampleEvent_Month: "5월"
  },
  {
    sampleEvent_ID: 7,
    sampleEvent_Name: "조정관 학교 101",
    sampleEvent_Location: "미정",
    sampleEvent_Year: "미정",
    sampleEvent_Start_Date: null,
    sampleEvent_End_Date: null,
    sampleEvent_Registration_Start_Date: null,
    sampleEvent_Registration_End_Date: null,
    sampleEvent_Open_Available: "비공개",
    sampleEvent_Place: "미정",
    sampleEvent_Month: "6월"
  },
  {
    sampleEvent_ID: 8,
    sampleEvent_Name: "조정관 학교 201",
    sampleEvent_Location: "미정",
    sampleEvent_Year: "미정",
    sampleEvent_Start_Date: null,
    sampleEvent_End_Date: null,
    sampleEvent_Registration_Start_Date: null,
    sampleEvent_Registration_End_Date: null,
    sampleEvent_Open_Available: "비공개",
    sampleEvent_Place: "미정",
    sampleEvent_Month: "6월"
  },
  {
    sampleEvent_ID: 9,
    sampleEvent_Name: "T&T Camp",
    sampleEvent_Location: "미정",
    sampleEvent_Year: "미정",
    sampleEvent_Start_Date: null,
    sampleEvent_End_Date: null,
    sampleEvent_Registration_Start_Date: null,
    sampleEvent_Registration_End_Date: null,
    sampleEvent_Open_Available: "비공개",
    sampleEvent_Place: "미정",
    sampleEvent_Month: "7월"
  },
  {
    sampleEvent_ID: 10,
    sampleEvent_Name: "감독관 학교 101",
    sampleEvent_Location: "미정",
    sampleEvent_Year: "미정",
    sampleEvent_Start_Date: null,
    sampleEvent_End_Date: null,
    sampleEvent_Registration_Start_Date: null,
    sampleEvent_Registration_End_Date: null,
    sampleEvent_Open_Available: "비공개",
    sampleEvent_Place: "미정",
    sampleEvent_Month: "8월"
  },
  {
    sampleEvent_ID: 11,
    sampleEvent_Name: "YM MIT",
    sampleEvent_Location: "미정",
    sampleEvent_Year: "미정",
    sampleEvent_Start_Date: null,
    sampleEvent_End_Date: null,
    sampleEvent_Registration_Start_Date: null,
    sampleEvent_Registration_End_Date: null,
    sampleEvent_Open_Available: "비공개",
    sampleEvent_Place: "미정",
    sampleEvent_Month: "8월"
  },
  {
    sampleEvent_ID: 12,
    sampleEvent_Name: "하반기 연합 BT",
    sampleEvent_Location: "미정",
    sampleEvent_Year: "미정",
    sampleEvent_Start_Date: null,
    sampleEvent_End_Date: null,
    sampleEvent_Registration_Start_Date: null,
    sampleEvent_Registration_End_Date: null,
    sampleEvent_Open_Available: "비공개",
    sampleEvent_Place: "미정",
    sampleEvent_Month: "9월"
  },
  {
    sampleEvent_ID: 13,
    sampleEvent_Name: "영성수련회",
    sampleEvent_Location: "미정",
    sampleEvent_Year: "미정",
    sampleEvent_Start_Date: null,
    sampleEvent_End_Date: null,
    sampleEvent_Registration_Start_Date: null,
    sampleEvent_Registration_End_Date: null,
    sampleEvent_Open_Available: "비공개",
    sampleEvent_Place: "미정",
    sampleEvent_Month: "10월"
  },
  {
    sampleEvent_ID: 14,
    sampleEvent_Name: "성경퀴즈대회 설명회",
    sampleEvent_Location: "미정",
    sampleEvent_Year: "미정",
    sampleEvent_Start_Date: null,
    sampleEvent_End_Date: null,
    sampleEvent_Registration_Start_Date: null,
    sampleEvent_Registration_End_Date: null,
    sampleEvent_Open_Available: "비공개",
    sampleEvent_Place: "미정",
    sampleEvent_Month: "11월"
  },
  {
    sampleEvent_ID: 15,
    sampleEvent_Name: "비전캠프",
    sampleEvent_Location: "미정",
    sampleEvent_Year: "미정",
    sampleEvent_Start_Date: null,
    sampleEvent_End_Date: null,
    sampleEvent_Registration_Start_Date: null,
    sampleEvent_Registration_End_Date: null,
    sampleEvent_Open_Available: "비공개",
    sampleEvent_Place: "미정",
    sampleEvent_Month: "12월"
  },
  {
    sampleEvent_ID: 16,
    sampleEvent_Name: "장학캠프",
    sampleEvent_Location: "미정",
    sampleEvent_Year: "미정",
    sampleEvent_Start_Date: null,
    sampleEvent_End_Date: null,
    sampleEvent_Registration_Start_Date: null,
    sampleEvent_Registration_End_Date: null,
    sampleEvent_Open_Available: "비공개",
    sampleEvent_Place: "미정",
    sampleEvent_Month: "미정"
  },
  {
    sampleEvent_ID: 17,
    sampleEvent_Name: "수시 BT",
    sampleEvent_Location: "미정",
    sampleEvent_Year: "미정",
    sampleEvent_Start_Date: null,
    sampleEvent_End_Date: null,
    sampleEvent_Registration_Start_Date: null,
    sampleEvent_Registration_End_Date: null,
    sampleEvent_Open_Available: "비공개",
    sampleEvent_Place: "미정",
    sampleEvent_Month: "미정"
  }
];

// 다음 사용 가능한 subId를 찾는 함수
async function findNextAvailableSubId(mainId: string): Promise<string> {
  const existingChurches = await Church.find({ mainId }).sort({ subId: 1 });
  const usedSubIds = new Set(existingChurches.map(church => church.subId));
  
  // a부터 z까지 순회하면서 사용 가능한 첫 번째 알파벳 찾기
  for (let i = 97; i <= 122; i++) { // 97은 'a'의 ASCII 코드, 122는 'z'의 ASCII 코드
    const subId = String.fromCharCode(i);
    if (!usedSubIds.has(subId)) {
      return subId;
    }
  }
  throw new Error(`${mainId}에 대해 사용 가능한 subId가 없습니다 (a-z 모두 사용 중).`);
}

async function importChurchData() {
  try {
    // MongoDB 연결
    await mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/church-service');
    console.log('MongoDB에 연결되었습니다.');

    // 기존 데이터 삭제
    await Church.deleteMany({});
    console.log('기존 교회 데이터가 삭제되었습니다.');

    // mainId별로 교회 데이터 그룹화
    const churchesByMainId = churches.reduce((acc, church) => {
      if (!acc[church.mainId]) {
        acc[church.mainId] = [];
      }
      acc[church.mainId].push(church);
      return acc;
    }, {} as Record<string, IChurch[]>);

    let totalModified = 0;
    let totalUpserted = 0;
    let totalMatched = 0;

    // mainId별로 처리
    for (const [mainId, churchGroup] of Object.entries(churchesByMainId)) {
      let subIdCounter = 0;
      
      for (const church of churchGroup) {
        try {
          // 기존 데이터가 있는지 확인
          const existingChurch = await Church.findOne({ 
            mainId: church.mainId,
            subId: church.subId
          });

          if (existingChurch) {
            // 이미 존재하는 경우, 다음 사용 가능한 subId 찾기
            const nextSubId = await findNextAvailableSubId(church.mainId);
            console.log(`교회 ${church.name}의 subId를 ${church.subId}에서 ${nextSubId}로 변경합니다.`);
            church.subId = nextSubId;
          }

          // upsert 수행
          const result = await Church.updateOne(
            { mainId: church.mainId, subId: church.subId },
            { $set: church },
            { upsert: true }
          );

          if (result.modifiedCount) totalModified++;
          if (result.upsertedCount) totalUpserted++;
          if (result.matchedCount) totalMatched++;

        } catch (error: any) {
          if (error.code === 11000) {
            console.warn(`중복 오류 발생: ${church.name} (${church.mainId}-${church.subId})`);
            // 다음 사용 가능한 subId로 재시도
            try {
              const nextSubId = await findNextAvailableSubId(church.mainId);
              console.log(`재시도: subId를 ${nextSubId}로 변경하여 시도합니다.`);
              church.subId = nextSubId;
              
              const retryResult = await Church.updateOne(
                { mainId: church.mainId, subId: church.subId },
                { $set: church },
                { upsert: true }
              );

              if (retryResult.modifiedCount) totalModified++;
              if (retryResult.upsertedCount) totalUpserted++;
              if (retryResult.matchedCount) totalMatched++;

            } catch (retryError) {
              console.error(`재시도 실패: ${church.name}`, retryError);
            }
          } else {
            console.error(`교회 데이터 처리 중 오류 발생: ${church.name}`, error);
          }
        }
      }
    }

    console.log(`처리된 교회 데이터:
      - 수정된 문서: ${totalModified}
      - 삽입된 문서: ${totalUpserted}
      - 매칭된 문서: ${totalMatched}
    `);

    // 샘플 이벤트 데이터 임포트
    const sampleEventCollection = mongoose.connection.collection('sampleEvents');
    await sampleEventCollection.deleteMany({});
    await sampleEventCollection.insertMany(sampleEvents);
    console.log('샘플 이벤트 데이터가 성공적으로 임포트되었습니다.');

    // 샘플 이벤트 인덱스 생성
    await sampleEventCollection.createIndex({ sampleEvent_ID: 1 }, { unique: true });
    await sampleEventCollection.createIndex({ sampleEvent_Name: 1 });
    await sampleEventCollection.createIndex({ sampleEvent_Month: 1 });
    console.log('샘플 이벤트 인덱스가 생성되었습니다.');

    await mongoose.disconnect();
    console.log('MongoDB 연결이 종료되었습니다.');
  } catch (error) {
    console.error('데이터 가져오기 오류:', error);
    process.exit(1);
  }
}

// 스크립트 실행
importChurchData(); 