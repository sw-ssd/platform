/**
 * 跨頁共用的輸入形狀檢查。
 *
 * 這些形狀必須與後端解析器一致（money.ParseCents / time.Parse(time.RFC3339)），
 * 否則前端會放行「註定被後端擋下」的輸入，使用者白跑一趟。
 * 集中在此處，避免各頁各寫一份導致日後漂移。
 */

/** 金額：整數位 ＋ 最多兩位小數；與後端 `money.ParseCents` 相同形狀。 */
export const MONEY_PATTERN = /^\d+(\.\d{1,2})?$/;

/** 時間：RFC3339（可帶小數秒、Z 或 ±hh:mm 時區），與後端 `time.Parse(time.RFC3339)` 對齊。 */
export const RFC3339_PATTERN =
  /^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}(\.\d+)?(Z|[+-]\d{2}:\d{2})$/;
