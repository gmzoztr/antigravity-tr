const { test } = require('node:test');
const assert = require('node:assert/strict');
const { translateDynamic } = require('../src/desktop_dynamic');
test('quota durations translate without freezing the countdown', () => {
  assert.equal(translateDynamic('Resets in 16h 24m'), '16 saat 24 dakika sonra yenilenir');
  assert.equal(translateDynamic('Resets in 1d 18h'), '1 gün 18 saat sonra yenilenir');
  assert.equal(translateDynamic('You have used some of your weekly limit, it will fully refresh in 16 hours, 24 minutes.'), 'Haftalık limitinizin bir kısmını kullandınız. Limit 16 saat, 24 dakika sonra tamamen yenilenir.');
  assert.equal(translateDynamic('You have hit your 5-hour limit, it will refresh in 2 hours, 22 minutes. If on a supported paid plan, you can use AI credits in the interim.'), 'Beş saatlik limitinize ulaştınız. Limit 2 saat, 22 dakika sonra yenilenir. Desteklenen ücretli bir plandaysanız bu sırada AI kredilerini kullanabilirsiniz.');
  assert.match(translateDynamic('You have hit your 5-hour limit, so the weekly limit does not currently apply. Your 5-hour limit will refresh in 2 hours, 22 minutes.'), /^Beş saatlik/);
  assert.equal(translateDynamic('(1.148 tokens)'), '(1.148 token)');
  for (const text of ['16h 24m', 'My project 123', 'Resets in unknown', 'Gemini 3.8 Flash']) assert.equal(translateDynamic(text), text);
});
