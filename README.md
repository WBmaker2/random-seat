# 🏫 우리 반 자리 뽑기 (Classroom Random Seat Picker)

> 🔗 **실제 서비스 바로가기 (Live Demo)**: **[https://wbmaker2.github.io/random-seat/](https://wbmaker2.github.io/random-seat/)**

선생님과 학생들이 함께 사용하는 **초등학교·중학교·고등학교 교실용 모둠 자리 무작위 뽑기 웹 애플리케이션**입니다.  
학생 수와 모둠 수를 입력하면 1번부터 마지막 번호까지의 학생 번호를 중복 없이 무작위로 섞어, 실제 교실 칠판/교탁 기준 모둠별 마주보는 자리 배치표를 시각화합니다.

---

## ✨ 주요 기능

1. **🎲 공정하고 완벽한 무작위 추첨 (Fisher-Yates & Round-Robin)**
   - 1번부터 N번까지 중복 없이 균등한 확률로 셔플
   - 인원이 나누어떨어지지 않을 때도 앞쪽 모둠부터 1명씩 고르게 배분
   - 학생 이름 입력 없이 **오직 번호로만 깔끔하게 표시**

2. **⚡ 슬롯머신 롤링 & 순차적 멈춤 애니메이션**
   - 뽑기 버튼 클릭 시 모든 좌석의 번호가 초고속으로 회전하며 긴장감 유발
   - 1모둠부터 차례대로 "탁!" 소리와 함께 고정되는 순차적 스톱 연출
   - 마지막 모둠까지 확정 시 화려한 **색종이 폭죽(Confetti)** 및 팡파르 피날레

3. **🔊 Web Audio API 기반 실감 나는 효과음**
   - 외부 오디오 파일 다운로드 없이 브라우저 자체 신디사이저로 즉시 재생
   - 회전음 (Tick), 확정음 (Lock), 축하 팡파르 (Fanfare)
   - 상단 버튼으로 언제든 무음(음소거) 전환 가능

4. **🏫 교실 맞춤형 UI/UX**
   - **칠판 / 교탁 기준점**: 교실 앞쪽 및 복도/창가 방향 직관적 제공
   - **마주보는 모둠 테이블 (Desk Pods)**: 2열로 서로 마주보는 실제 교실 책상 구조
   - **빠른 프리셋**: `20명 4모둠`, `24명 6모둠`, `28명 7모둠`, `30명 6모둠`
   - **단축키 지원**: `Space` 또는 `Enter` 키로 즉각 뽑기 / 다시 뽑기 실행
   - **전체화면 모드**: 전자칠판 / 빔프로젝터 대화면 최적화
   - **인쇄 / 저장 지원**: 교실 뒤판 부착용 A4 인쇄 스타일 최적화

---

## 🛠️ 기술 스택

- **Frontend**: React 18, TypeScript, Vite
- **Styling**: Tailwind CSS, Lucide React
- **Animations**: CSS Keyframes, Canvas-Confetti
- **Audio**: Web Audio API (Zero external assets)
- **Testing**: Vitest, React Testing Library (65 tests passing)
- **Deployment**: GitHub Pages (GitHub Actions CI/CD)

---

## 💻 로컬 실행 방법

```bash
# 의존성 설치
npm install

# 개발 서버 실행
npm run dev

# 단위 및 통합 테스트 실행
npm test

# 프로덕션 빌드
npm run build
```
