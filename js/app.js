document.addEventListener('DOMContentLoaded', () => {
  const form = document.getElementById('sentiment-form');
  const textInput = document.getElementById('text-input');
  const charCount = document.getElementById('char-count');
  const analyzeBtn = document.getElementById('analyze-button');
  const statusMessage = document.getElementById('status-message');
  
  const resultSection = document.getElementById('result-section');
  const sentimentLabel = document.getElementById('sentiment-label');
  const confidenceValue = document.getElementById('confidence-value');
  const confidenceBar = document.getElementById('confidence-bar');
  const reasonText = document.getElementById('reason-text');

  // 감성별 허용된 CSS 클래스 및 라벨 매핑
  const ALLOWED_SENTIMENTS = {
    positive: { className: 'positive', label: '긍정' },
    negative: { className: 'negative', label: '부정' },
    neutral: { className: 'neutral', label: '중립' }
  };

  // 1. 글자 수 실시간 카운트
  textInput.addEventListener('input', () => {
    const currentLength = textInput.value.length;
    charCount.textContent = currentLength.toLocaleString();
    if (currentLength > 2000) {
      charCount.style.color = 'var(--color-negative)';
    } else {
      charCount.style.color = '';
    }
  });

  // 상태 메시지 표시 함수
  function showStatus(message, type = 'error') {
    statusMessage.textContent = message; // 보안: innerHTML 대신 textContent 사용
    statusMessage.className = `status-message is-active ${type === 'error' ? 'is-error' : 'is-loading'}`;
  }

  // 상태 메시지 초기화
  function hideStatus() {
    statusMessage.textContent = '';
    statusMessage.className = 'status-message';
  }

  // 2. 폼 제출 처리
  form.addEventListener('submit', async (e) => {
    e.preventDefault();
    hideStatus();

    const rawText = textInput.value;
    const trimmedText = rawText.trim();

    // 유효성 검사 1: 빈 문자열 / 공백만 있는 경우
    if (trimmedText.length === 0) {
      showStatus('분석할 문장을 입력해 주세요.');
      textInput.focus();
      return;
    }

    // 유효성 검사 2: 글자 수 초과
    if (rawText.length > 2000) {
      showStatus('문장은 최대 2,000자까지 입력할 수 있어요.');
      return;
    }

    // 로딩 상태 시작
    analyzeBtn.disabled = true;
    analyzeBtn.textContent = '감정 분석 중...';
    showStatus('문장을 분석하고 있어요. 잠시만 기다려 주세요...', 'loading');

    try {
      const response = await fetch('/api/analyze', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ text: trimmedText })
      });

      let data;
      try {
        data = await response.json();
      } catch {
        throw new Error('SERVER_INVALID_RESPONSE');
      }

      if (!response.ok || !data.success) {
        const errorMsg = data?.error?.message || '분석 중 문제가 발생했어요. 잠시 후 다시 시도해 주세요.';
        showStatus(errorMsg);
        return;
      }

      // 결과 검증 및 렌더링
      const { sentiment, label, confidence, reason } = data.result || {};
      const validSentiment = ALLOWED_SENTIMENTS[sentiment];

      if (!validSentiment || typeof confidence !== 'number' || typeof reason !== 'string') {
        showStatus('분석 결과를 불러오는 중 문제가 발생했어요. 잠시 후 다시 시도해 주세요.');
        return;
      }

      // 안전한 렌더링: textContent 사용
      sentimentLabel.textContent = validSentiment.label;
      sentimentLabel.className = `sentiment-badge ${validSentiment.className}`;
      
      const safeConfidence = Math.max(0, Math.min(100, Math.round(confidence)));
      confidenceValue.textContent = `${safeConfidence}%`;
      confidenceBar.style.width = `${safeConfidence}%`;
      
      reasonText.textContent = reason; // XSS 방지: textContent

      // 결과 영역 표시 및 스크롤
      resultSection.classList.add('is-visible');
      hideStatus();
      resultSection.scrollIntoView({ behavior: 'smooth', block: 'nearest' });

    } catch (err) {
      console.error('Fetch Error:', err);
      showStatus('서버에 연결하지 못했어요. 잠시 후 다시 시도해 주세요.');
    } finally {
      // 버튼 복구
      analyzeBtn.disabled = false;
      analyzeBtn.textContent = '감정 분석하기';
    }
  });
});

