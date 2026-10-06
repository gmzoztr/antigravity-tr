// Only recognized UI sentences are transformed; arbitrary numbers and content are untouched.
function translateDynamic(text) {
  const thought = /^Thought for (\d+(?:\.\d+)?)s$/.exec(text);
  if (thought) return thought[1] + ' saniye düşündü';
  const updatedTime = /^Updated (\d{1,2}:\d{2})$/.exec(text);
  if (updatedTime) return 'Güncellendi: ' + updatedTime[1];
  const consentPrefix = /^Yes, I agree to help improve Antigravity by allowing Google to collect and use my\s+Interactions data, subject to the(?=\s|$)/;
  if (consentPrefix.test(text)) return text.replace(consentPrefix, 'Evet, Google’ın etkileşim verilerimi aşağıdaki koşullara tabi olarak toplamasına ve kullanmasına izin vererek Antigravity’nin geliştirilmesine katkıda bulunmayı kabul ediyorum:');

  const updated = /^Updated (\d{1,2} [A-Za-zÇçĞğİıÖöŞşÜü.]+, \d{1,2}:\d{2})$/.exec(text);
  if (updated) return 'Güncellendi: ' + updated[1];
  const baselineQuota = /^Your plan's baseline quota will refresh on (.+)\.$/.exec(text);
  if (baselineQuota) return 'Planınızın temel kotası ' + baselineQuota[1] + ' tarihinde yenilenecek.';
  if (text === 'tokens (') return 'token (';
  const breakdown = /^Show (\d+) breakdowns?$/.exec(text);
  if (breakdown) return breakdown[1] + ' Ayrıntıyı Göster';
  const tokenBudget = /^([\d.,]+\s*\/\s*[\d.,]+) tokens (\([\d.,]+%\))$/.exec(text);
  if (tokenBudget) return tokenBudget[1] + ' token ' + tokenBudget[2];
  const changedFiles = /^(\d+) files? changed$/.exec(text);
  if (changedFiles) return changedFiles[1] + ' Dosya Değiştirildi';
  const readAll = /^Mark all (\d+) conversations as read$/.exec(text);
  if (readAll) return readAll[1] + ' Konuşmanın Tümünü Okundu Olarak İşaretle';
  const credits = /^Available AI Credits:\s*([\d.,]+)$/.exec(text);
  if (credits) return 'Kullanılabilir AI Kredisi: ' + credits[1];
  if (text === 'tokens)') return 'token)';
  function duration(value) {
    if (!/^(?:\d+\s*(?:days?|hours?|minutes?|seconds?|d|h|m|s)(?:,?\s*|$))+$/.test(value)) return null;
    return value.replace(/(\d+)\s*(days?|hours?|minutes?|seconds?|d|h|m|s)\b/g,
      (_, n, unit) => n + ' ' + ({ d: 'gün', h: 'saat', m: 'dakika', s: 'saniye' }[unit[0]]));
  }
  let match = /^Resets in (.+)$/.exec(text);
  if (match) { const time = duration(match[1]); return time ? time + ' sonra yenilenir' : text; }
  match = /^(Claude (?:Sonnet|Opus) [\d.]+|GPT-OSS \d+B) \((Thinking|Medium|High|Low)\)$/.exec(text);
  if (match) return match[1] + ' (' + ({ Thinking: 'Düşünme', Medium: 'Orta', High: 'Yüksek', Low: 'Düşük' }[match[2]]) + ')';
  match = /^You have used some of your (weekly|5-hour) limit, it will fully refresh in (.+)\.$/.exec(text);
  if (match) {
    const time = duration(match[2]);
    return time ? (match[1] === 'weekly' ? 'Haftalık' : 'Beş saatlik') + ' limitinizin bir kısmını kullandınız. Limit ' + time + ' sonra tamamen yenilenir.' : text;
  }
  match = /^You have hit your 5-hour limit, so the weekly limit does not currently apply\. Your 5-hour limit will refresh in (.+)\.$/.exec(text);
  if (match) { const time = duration(match[1]); return time ? 'Beş saatlik limitinize ulaştınız; haftalık limit şu anda geçerli değil. Beş saatlik limitiniz ' + time + ' sonra yenilenir.' : text; }
  match = /^You have hit your (weekly|5-hour) limit, it (?:will refresh|refreshes) in (.+)\. If on a supported paid plan, you can use AI credits in the interim( or upgrade to a higher tier)?\.$/.exec(text);
  if (match) {
    const time = duration(match[2]);
    return time ? (match[1] === 'weekly' ? 'Haftalık' : 'Beş saatlik') + ' limitinize ulaştınız. Limit ' + time + ' sonra yenilenir. Desteklenen ücretli bir plandaysanız bu sırada AI kredilerini kullanabilirsiniz' + (match[3] ? ' veya daha yüksek bir plana geçebilirsiniz.' : '.') : text;
  }
  match = /^(\(?[\d.,]+) tokens(\)?)$/.exec(text);
  if (match) return match[1] + ' token' + match[2];
  return text;
}
module.exports = { translateDynamic };
