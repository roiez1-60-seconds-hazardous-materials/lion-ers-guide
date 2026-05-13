// ============================================================
// i18n.js — Complete translation layer for LION ERS app
// Loads AFTER main script. Injects UI + overrides data.
// ============================================================
(function(){
"use strict";

// --- Inject CSS ---
const css=document.createElement('style');
css.textContent=`
.lang-sw{display:flex;gap:3px;flex-shrink:0;margin:0 8px}
.lang-sw button{padding:4px 8px;border-radius:6px;font-size:11px;font-weight:700;cursor:pointer;border:1px solid #EDEBE7;background:#F7F5F2;color:#7A7267;transition:all .2s;font-family:inherit}
.lang-sw button.active{background:rgba(192,57,43,.08);border-color:rgba(192,57,43,.2);color:#C0392B}
`;
document.head.appendChild(css);

// --- Inject language buttons into header ---
const hdr=document.querySelector('.header');
if(hdr){
  const sw=document.createElement('div');
  sw.className='lang-sw';
  sw.innerHTML='<button class="active" data-l="he">עב</button><button data-l="en">EN</button><button data-l="zh">中文</button>';
  const nav=hdr.querySelector('nav');
  hdr.insertBefore(sw,nav);
  sw.addEventListener('click',e=>{
    if(e.target.tagName!=='BUTTON')return;
    sw.querySelectorAll('button').forEach(b=>b.classList.remove('active'));
    e.target.classList.add('active');
    setLang(e.target.dataset.l);
  });
}

// --- Current language ---
let curLang='he';

// ============================================================
// TRANSLATIONS — Every string in all 3 languages
// ============================================================
const T={
nav:{he:['סקירה','רכיבים','עץ החלטה','התמגנות','הפשטה','סימולציה','תחזוקה','בטיחות','תרגול'],en:['Overview','Components','Decision','Donning','Doffing','Simulation','Maintenance','Safety','Practice'],zh:['概述','组件','决策','穿戴','脱卸','模拟','维护','安全','练习']},
hero_title:{he:'חליפת התערבות מהירה<br><em>LION ERS</em>',en:'Rapid Intervention Suit<br><em>LION ERS</em>',zh:'快速干预防护服<br><em>LION ERS</em>'},
hero_desc:{he:'מדריך אינטראקטיבי ללוחמי האש — סימולציה, התמגנות, הפשטה ותחזוקה',en:'Interactive firefighter guide — simulation, donning, doffing & maintenance',zh:'消防员互动指南 — 模拟、穿戴、脱卸与维护'},
hero_labels:{he:['משקל','עבודה מרביות','אורך חיים','מרביות'],en:['Weight','Max Hours','Lifespan','Max Washes'],zh:['重量','最大工时','寿命','最大清洗']},
hero_units:{he:[' ק"ג',' שעות',' שנים',' שטיפות'],en:[' kg',' hours',' years',' washes'],zh:[' 公斤',' 小时',' 年',' 次']},
// --- Section headers [title, subtitle] ---
sh:{he:{overview:['סקירה כללית','הכרת החליפה — ייעוד, מאפיינים ומגבלות'],components:['רכיבי הערכה','לחצו על כל רכיב בתמונה לפרטים נוספים'],decision:['עץ החלטה אינטראקטיבי','ענה על השאלות ותגיע לחליפה המתאימה'],donning:['סדר פעולות התמגנות','שלב אחר שלב — עם תמונות ומצב תרגול'],doffing:['סדר פעולות הפשטה','בטיחות ומניעת זיהום — שלב אחר שלב'],simulation:['סימולציית אירוע','הגעת לזירה — קבל החלטות נכונות צעד אחר צעד'],maintenance:['תחזוקה','ניקוי, אחסון, בדיקה וקיפול'],safety:['בטיחות','מגבלות שימוש'],quiz:['תרגול ובחינת ידע','חידון, כרטיסיות זיכרון ואתגר סדר — בחר מצב']},
en:{overview:['General Overview','Suit purpose, features & limitations'],components:['Equipment Components','Click any component for details'],decision:['Interactive Decision Tree','Answer questions to find the right suit'],donning:['Donning Procedure','Step by step with photos & practice mode'],doffing:['Doffing Procedure','Safety & contamination prevention'],simulation:['Incident Simulation','Arrive at scene — make right decisions step by step'],maintenance:['Maintenance','Cleaning, storage, inspection & folding'],safety:['Safety','Usage limitations'],quiz:['Practice & Knowledge Test','Quiz, flashcards & ordering challenge']},
zh:{overview:['总体概述','防护服用途、特性和限制'],components:['装备组件','点击组件查看详情'],decision:['互动决策树','回答问题找到合适的防护服'],donning:['穿戴程序','逐步操作 — 带照片和练习模式'],doffing:['脱卸程序','安全与防污染'],simulation:['事件模拟','到达现场 — 逐步做正确决策'],maintenance:['维护','清洁、存储、检查和折叠'],safety:['安全','使用限制'],quiz:['练习与知识测试','测验、闪卡和排序挑战']}},
// --- Component names & descriptions ---
comp_names:{he:['חליפת LION ERS','כפפה פנימית תפורה לחליפה','כפפה חיצונית','מנ"פ ומסיכת מנ"פ','קסדה תקנית','מגפי כבאים תקינים','בגד עבודה'],en:['LION ERS Suit','Inner Glove (sewn)','Outer Glove','SCBA & Mask','Helmet','Fire Boots','Work Clothes'],zh:['LION ERS防护服','内手套（缝合）','外手套','呼吸器和面罩','头盔','消防靴','工作服']},
comp_descs:{he:['הגנה כימית. ברדס, גרביים, רוכסן. 2.7 ק"ג.','GORE CHEMPAK G94-C3L — הגנה כימית.','ANSELL HyFlex 11-801 — הגנה מכנית.','מערכת נשימה פתוחה + גליל מלא. רצועות בלבד!','כולל רצועת אבטחה. נלבשת אחרונה.','קצוות המכנס מושחלים מעליהם (הרעפה).','חולצה מבד נושם ומכנסיים ארוכים.'],en:['Chemical protection. Hood, socks, zipper. 2.7kg.','GORE CHEMPAK G94-C3L — Chemical protection.','ANSELL HyFlex 11-801 — Mechanical protection.','Open-circuit + full cylinder. Straps only!','Includes chin strap. Last to don.','Pants tucked over boots.','Breathable shirt & long pants.'],zh:['化学防护。头罩、内袜、拉链。2.7公斤。','GORE CHEMPAK G94-C3L — 化学防护。','ANSELL HyFlex 11-801 — 机械防护。','开路呼吸器+满瓶。仅系带！','含下颏带。最后佩戴。','裤腿套在靴外。','透气衬衫和长裤。']},
// --- Donning step [title, description] ---
don_prep:{he:[['בדיקה ויזואלית','חפש חתכים, חורים, קרעים, שפשוף, סדקים או שינוי צבע.'],['ווידוא פריטים','כלל הפריטים תקינים. גליל מלא. בגד עבודה. חלוץ מגפיים. הסר תכשיטים.']],en:[['Visual Inspection','Look for cuts, holes, tears, abrasion, cracks or discoloration.'],['Verify Equipment','All items OK. Full cylinder. Work clothes. Remove boots & jewelry.']],zh:[['目视检查','检查切口、孔洞、撕裂、磨损、裂纹或变色。'],['确认装备','所有物品正常。气瓶满。穿工作服。脱靴。取下首饰。']]},
don_steps:{he:[['רגליים לחליפה','פתח רוכסן, הכנס רגליים עד גרביים, הרם למותניים.'],['קשירת שרוולים','קשור סביב המותניים.'],['מגפי כבאים','נעול מגפיים תקניות.'],['הרעפה','קצוות מכנס מעל מגפיים.'],['מסיכת מנ"פ + אטימות','עם רצועות! בדיקת אטימות.'],['כפפות הזעה','בד כותנה.'],['זרועות לשרוולים','הכנס זרועות.'],['כפפות חיצוניות','ANSELL HyFlex 11-801.'],['ברדס','משוך ווודא אטם על גומי המסכה.'],['רוכסן','סגור עד הסוף + כיסוי.'],['מנ"פ','על הגב, הדק רצועות.'],['אוויר + לחץ','פתח ובדוק בשעון.'],['קסדה','תקנית + רצועת אבטחה.'],['ווסת + קשר','חבר ווסת, וודא אטימות, בדיקת קשר.']],
en:[['Legs into suit','Open zipper, legs to socks, raise to waist.'],['Tie sleeves','Tie around waist.'],['Fire boots','Put on boots.'],['Tuck pants','Pant legs over boots.'],['Mask + seal test','Straps only! Seal check.'],['Sweat gloves','Cotton fabric.'],['Arms in','Insert arms.'],['Outer gloves','ANSELL HyFlex 11-801.'],['Hood','Pull, verify seal on mask rubber.'],['Zipper','Close fully + cover.'],['SCBA','On back, tighten straps.'],['Air + pressure','Open, check gauge.'],['Helmet','Standard + chin strap.'],['Regulator + radio','Connect, verify seal, radio check.']],
zh:[['腿部穿入','开拉链，腿入内袜，提至腰。'],['系袖子','系在腰间。'],['消防靴','穿标准靴。'],['裤腿套叠','裤腿套靴外。'],['面罩+密封','仅系带！密封测试。'],['汗手套','棉布。'],['手臂穿入','插入手臂。'],['外手套','ANSELL HyFlex 11-801。'],['头罩','拉上，确认密封。'],['拉链','完全关闭+盖板。'],['呼吸器','背上，收紧。'],['气源+压力','打开检查。'],['头盔','标准+下颏带。'],['调节器+通讯','连接，密封，通讯检查。']]},
don_notes:{5:{he:'⚠️ אין קליפס',en:'⚠️ No clips',zh:'⚠️ 禁用卡扣'},9:{he:'⚠️ בסיוע איש צוות',en:'⚠️ With teammate',zh:'⚠️ 需队员协助'},10:{he:'⚠️ בסיוע איש צוות',en:'⚠️ With teammate',zh:'⚠️ 需队员协助'}},
don_check:{he:['אטימה סביב המסכה והכובע','סגירת רוכסן מלאה','הרעפת מכנס למגפיים','כפפות חיצוניות לשרוול','בדיקת קשר','לחץ אוויר תקין'],en:['Mask & hood seal','Full zipper closure','Pants tucked in boots','Outer gloves to sleeve','Radio check','Air pressure OK'],zh:['面罩头罩密封','拉链完全关闭','裤腿套靴','外手套接袖','通讯检查','气压正常']},
// --- Doffing ---
doff_warn:{he:'<strong>שטוף את החליפה</strong> טרם הסרה. ארגן נעליים בסמיכות.',en:'<strong>Wash the suit</strong> before removal. Place shoes nearby.',zh:'<strong>清洗防护服</strong>后再脱卸。鞋放附近。'},
doff_steps:{he:[['הסרת קסדה','הסר קסדה.'],['מנ"פ + ווסת','הורד מנ"פ, נתק ווסת.'],['פתיחת רוכסן','פתח.'],['הסרת ברדס','הסר ממסיכת הפנים.'],['שליפת ידיים','ללא מגע חיצוני.'],['הסרת מסכה','הסר.'],['הורדת חליפה','הפשטה מבוקרת. צא עם מגפיים ללא מגע חיצוני.'],['כפפות הזעה','הסר. פעל לפי הוראות טיפול.']],
en:[['Remove helmet','Remove.'],['SCBA + regulator','Remove SCBA, disconnect.'],['Open zipper','Open.'],['Remove hood','From face mask.'],['Hands out','No outer contact.'],['Remove mask','Remove.'],['Lower suit','Controlled. Step out with boots, no outer contact.'],['Sweat gloves','Remove. Follow care instructions.']],
zh:[['取头盔','取下。'],['呼吸器+调节器','取下，断开。'],['开拉链','打开。'],['取头罩','从面罩取下。'],['抽手','不触外面。'],['取面罩','取下。'],['脱服','控制脱卸。连靴出来。'],['汗手套','取下。按说明操作。']]},
doff_notes:{4:{he:'⚠️ מנע מגע בפנים/ראש חשופים!',en:'⚠️ No contact with exposed face/head!',zh:'⚠️ 禁触裸露面部/头部！'}},
// --- Timer ---
timer:{he:{step:'שלב',start:'▶ התחל תרגול',next:'✓ שלב הבא',reset:'↺ אפס',done:'✅ הושלם!',title:'⏱️ מצב תרגול עם טיימר'},en:{step:'Step',start:'▶ Start',next:'✓ Next',reset:'↺ Reset',done:'✅ Done!',title:'⏱️ Practice Timer'},zh:{step:'步骤',start:'▶ 开始',next:'✓ 下一步',reset:'↺ 重置',done:'✅ 完成！',title:'⏱️ 计时练习'}},
// --- Donning/Doffing tabs ---
don_tabs:{he:['מכינות','לבישה','בדיקה'],en:['Preparation','Donning','Check'],zh:['准备','穿戴','检查']},
maint_tabs:{he:['ניקוי','בדיקה','קיפול','מועדים'],en:['Cleaning','Inspection','Folding','Schedule'],zh:['清洁','检查','折叠','时间表']},
quiz_tabs:{he:['🧠 חידון','🔄 כרטיסיות','🎯 אתגר סדר'],en:['🧠 Quiz','🔄 Flashcards','🎯 Order'],zh:['🧠 测验','🔄 闪卡','🎯 排序']},
// --- Quiz ---
quizData:{he:[{q:'באיזה מצב אין להשתמש?',o:['גז רעיל','נוזל קורוזיבי','גז דליק','ניטור'],c:2,e:'לא מיועדת לדליקים.'},{q:'סף שימוש מרבי?',o:['48 שעות / 5','24 שעות / 3','12 שעות / 2','36 שעות / 4'],c:1,e:'24 שעות או 3 שטיפות.'},{q:'סוג מסיכה?',o:['קליפס','רצועות','כל סוג','חצי פנים'],c:1,e:'רק רצועות.'},{q:'מתי בדיקה ויזואלית?',o:['אחרי אירוע','שבועית','1 בחודש','רבעונית'],c:2,e:'1 בחודש + אירוע/קבלה/שטיפה.'},{q:'מה אסור לניקוי?',o:['מים','סבון','מי חמצן','מים קרים'],c:2,e:'אין מי חמצן.'},{q:'איפה התמגנות?',o:['חם','פושר','קר','כל אזור'],c:2,e:'באזור הקר.'},{q:'כמה סוגי כפפות?',o:['1','2','3','4'],c:2,e:'הזעה+פנימית+חיצונית.'},{q:'שלב ראשון בהפשטה?',o:['קסדה','רוכסן','שטיפה','כפפות'],c:2,e:'שטיפת החליפה.'}],
en:[{q:'When NOT to use?',o:['Toxic gas','Corrosive liquid','Flammable gas','Monitoring'],c:2,e:'Not for flammables.'},{q:'Max usage?',o:['48h/5 washes','24h/3 washes','12h/2 washes','36h/4 washes'],c:1,e:'24 hours or 3 washes.'},{q:'Mask type?',o:['Clip-on','Strap-on','Any','Half-face'],c:1,e:'Straps only.'},{q:'Inspection when?',o:['After incident','Weekly','1st of month','Quarterly'],c:2,e:'Monthly + receipt/incident/wash.'},{q:'Prohibited cleaner?',o:['Water','Soap','H₂O₂','Cold water'],c:2,e:'No hydrogen peroxide.'},{q:'Donning zone?',o:['Hot','Warm','Cold','Any'],c:2,e:'Cold zone.'},{q:'Glove types?',o:['1','2','3','4'],c:2,e:'Sweat+inner+outer.'},{q:'First doffing step?',o:['Helmet','Zipper','Wash','Gloves'],c:2,e:'Wash suit first.'}],
zh:[{q:'何时禁用？',o:['毒气','腐蚀液','易燃气','监测'],c:2,e:'不适于易燃物。'},{q:'最大使用量？',o:['48h/5次','24h/3次','12h/2次','36h/4次'],c:1,e:'24小时或3次。'},{q:'面罩？',o:['卡扣','系带','任何','半面'],c:1,e:'仅系带。'},{q:'检查时间？',o:['事件后','每周','每月1日','每季'],c:2,e:'月+收/事/洗后。'},{q:'禁用清洁剂？',o:['水','肥皂','双氧水','冷水'],c:2,e:'禁双氧水。'},{q:'穿戴区？',o:['热','温','冷','任何'],c:2,e:'冷区。'},{q:'手套种类？',o:['1','2','3','4'],c:2,e:'汗+内+外。'},{q:'脱第一步？',o:['头盔','拉链','清洗','手套'],c:2,e:'先洗服。'}]},
// --- Flashcards ---
flashData:{he:[{q:'סף שימוש?',a:'24 שעות או 3 שטיפות'},{q:'מסיכה מותרת?',a:'רצועות בלבד — אין קליפס'},{q:'מהי הרעפה?',a:'קצוות מכנס מעל מגפיים'},{q:'שלב ראשון בהפשטה?',a:'שטיפת החליפה'},{q:'איפה התמגנות?',a:'אזור קר'},{q:'כפפה חיצונית?',a:'ANSELL HyFlex 11-801'},{q:'אסור לניקוי?',a:'מי חמצן'},{q:'כמה כפפות?',a:'3: הזעה, GORE, ANSELL'},{q:'אורך חיים?',a:'10 שנים'},{q:'מתי בדיקה?',a:'1 בחודש, קבלה, אירוע, שטיפה'}],
en:[{q:'Usage threshold?',a:'24 hours or 3 washes'},{q:'Allowed mask?',a:'Straps only — no clips'},{q:'What is tucking?',a:'Pant legs over boots'},{q:'First doffing step?',a:'Wash the suit'},{q:'Donning zone?',a:'Cold zone'},{q:'Outer glove?',a:'ANSELL HyFlex 11-801'},{q:'Prohibited cleaner?',a:'Hydrogen peroxide'},{q:'Glove types?',a:'3: sweat, GORE, ANSELL'},{q:'Lifespan?',a:'10 years'},{q:'Inspection when?',a:'Monthly, receipt, incident, wash'}],
zh:[{q:'使用阈值？',a:'24小时或3次清洗'},{q:'允许面罩？',a:'仅系带 — 禁卡扣'},{q:'什么是套叠？',a:'裤腿套靴外'},{q:'脱卸第一步？',a:'先洗服'},{q:'穿戴区？',a:'冷区'},{q:'外手套？',a:'ANSELL HyFlex 11-801'},{q:'禁用？',a:'双氧水'},{q:'手套？',a:'3种：汗、GORE、ANSELL'},{q:'寿命？',a:'10年'},{q:'检查？',a:'每月、收货、事件、清洗后'}]},
// --- Drag steps ---
dragSteps:{he:['פתיחת רוכסן והכנסת רגליים','קשירת שרוולים','נעילת מגפיים','הרעפת מכנס','מסיכת מנ"פ + אטימות','כפפות הזעה','זרועות לשרוולים','כפפות חיצוניות','משיכת ברדס','סגירת רוכסן','לבישת מנ"פ','פתיחת אוויר','קסדה','חיבור ווסת + קשר'],en:['Open zipper & insert legs','Tie sleeves','Put on boots','Tuck pants','Mask + seal test','Sweat gloves','Arms into sleeves','Outer gloves','Pull hood','Close zipper','Don SCBA','Open air','Helmet','Regulator + radio'],zh:['开拉链穿腿','系袖','穿靴','套裤腿','面罩+密封','汗手套','臂入袖','外手套','拉头罩','关拉链','背呼吸器','开气阀','头盔','调节器+通讯']},
// --- Decision tree ---
dtTree:{he:[{q:'מה סוג החומר?',opts:[{t:'🔥 גז/נוזל דליק',next:1},{t:'⚗️ רעיל/קורוזיבי',next:2},{t:'❓ לא ידוע',next:5}]},{q:'דליק — משימה?',opts:[{t:'חילוץ',result:'attack'},{t:'ייצוב',result:'attack'},{t:'ניטור',result:'attack'}]},{q:'רעיל/קורוזיבי — משימה?',opts:[{t:'חילוץ בשטח פתוח',next:3},{t:'ייצוב מצב',next:3},{t:'שטיפת צוותים',result:'ers_wash'},{t:'ניטור',result:'ers_mon'}]},{q:'יש גם דליקים?',opts:[{t:'כן',result:'attack'},{t:'לא — רק רעיל',result:'ers'}]},{q:'',opts:[]},{q:'לא מזוהה — מצב בזירה?',opts:[{t:'עשן/להבות',result:'attack'},{t:'ריח/אדים בלבד',result:'ers'},{t:'לא ברור',result:'wait'}]}],
en:[{q:'Substance type?',opts:[{t:'🔥 Flammable gas/liquid',next:1},{t:'⚗️ Toxic/corrosive',next:2},{t:'❓ Unknown',next:5}]},{q:'Flammable — mission?',opts:[{t:'Rescue',result:'attack'},{t:'Stabilize',result:'attack'},{t:'Monitor',result:'attack'}]},{q:'Toxic/corrosive — mission?',opts:[{t:'Open-area rescue',next:3},{t:'Stabilize',next:3},{t:'Decon',result:'ers_wash'},{t:'Monitor',result:'ers_mon'}]},{q:'Flammables also present?',opts:[{t:'Yes',result:'attack'},{t:'No — toxic only',result:'ers'}]},{q:'',opts:[]},{q:'Unknown — scene status?',opts:[{t:'Smoke/flames',result:'attack'},{t:'Odor/vapors only',result:'ers'},{t:'Unclear',result:'wait'}]}],
zh:[{q:'物质类型？',opts:[{t:'🔥 易燃气/液',next:1},{t:'⚗️ 毒/腐蚀',next:2},{t:'❓ 未知',next:5}]},{q:'易燃 — 任务？',opts:[{t:'救援',result:'attack'},{t:'稳定',result:'attack'},{t:'监测',result:'attack'}]},{q:'毒/腐蚀 — 任务？',opts:[{t:'开放区救援',next:3},{t:'稳定',next:3},{t:'洗消',result:'ers_wash'},{t:'监测',result:'ers_mon'}]},{q:'也有易燃？',opts:[{t:'有',result:'attack'},{t:'无 — 仅毒',result:'ers'}]},{q:'',opts:[]},{q:'未知 — 现场？',opts:[{t:'烟/火',result:'attack'},{t:'仅气味',result:'ers'},{t:'不明',result:'wait'}]}]},
dtResults:{he:{attack:{icon:'🔥',title:'חליפת תקיפה ומנ"פ',desc:'דליק — אין התערבות מהירה!'},ers:{icon:'🛡️',title:'חליפת התערבות מהירה',desc:'מתאימה! בצע התמגנות.'},ers_wash:{icon:'🚿',title:'חליפת התערבות מהירה',desc:'מתאימה לשטיפה.'},ers_mon:{icon:'📡',title:'חליפת התערבות מהירה',desc:'מתאימה לניטור.'},wait:{icon:'⏳',title:'המתן למידע',desc:'אסוף מידע.'}},
en:{attack:{icon:'🔥',title:'Assault Suit & SCBA',desc:'Flammable — no rapid intervention!'},ers:{icon:'🛡️',title:'LION ERS Rapid Intervention',desc:'Suitable! Proceed with donning.'},ers_wash:{icon:'🚿',title:'LION ERS',desc:'Suitable for decon.'},ers_mon:{icon:'📡',title:'LION ERS',desc:'Suitable for monitoring.'},wait:{icon:'⏳',title:'Await Info',desc:'Gather information.'}},
zh:{attack:{icon:'🔥',title:'进攻服+呼吸器',desc:'易燃 — 禁用快速干预！'},ers:{icon:'🛡️',title:'LION ERS快速干预',desc:'适用！开始穿戴。'},ers_wash:{icon:'🚿',title:'LION ERS',desc:'适用于洗消。'},ers_mon:{icon:'📡',title:'LION ERS',desc:'适用于监测。'},wait:{icon:'⏳',title:'等待信息',desc:'收集信息。'}}},
// --- Simulation ---
simScenes:{he:[
{n:'🚨 דליפת חומצה גופרתית (1830) מכביש 4. רוח מערבית 15 קמ"ש. 3 נפגעים.',q:'פעולה ראשונה?',opts:[{t:'🏃 לרוץ להציל',c:false,f:'❌ בלי מיגון! קודם תמ"צ.'},{t:'📋 תמ"צ + מידע',c:true,f:'✅ נכון!'},{t:'📞 גיבוי והמתנה',c:false,f:'❌ קודם תמ"צ.'}]},
{n:'📋 חומצה גופרתית — קורוזיבי, לא דליק. חילוץ 3.',q:'חליפה?',opts:[{t:'🔥 תקיפה',c:false,f:'❌ לדליקים.'},{t:'🛡️ התערבות מהירה',c:true,f:'✅ קורוזיבי + חילוץ = ERS.'},{t:'👕 בגד עבודה',c:false,f:'❌ חומצה = הגנה מלאה.'}]},
{n:'🧥 בחרת ERS. מתמגן.',q:'ראשון?',opts:[{t:'👢 מגפיים',c:false,f:'❌ בדיקה ויזואלית!'},{t:'🔍 בדיקה ויזואלית',c:true,f:'✅ תמיד קודם!'},{t:'😷 מסיכה',c:false,f:'❌ מסיכה מאוחר.'}]},
{n:'✅ רגליים, שרוולים, מגפיים, הרעפה. עכשיו מסיכה.',q:'סוג מסיכה?',opts:[{t:'קליפס',c:false,f:'❌ אסור!'},{t:'רצועות',c:true,f:'✅ כלל ברזל.'},{t:'כל סוג',c:false,f:'❌ רק רצועות.'}]},
{n:'😷 התמגנות הושלמה. איש צוות בודק.',q:'מה בודק?',opts:[{t:'רוכסן בלבד',c:false,f:'❌ 6 פרמטרים!'},{t:'אטימה, רוכסן, הרעפה, כפפות, קשר, לחץ',c:true,f:'✅ בדיקה מקיפה.'},{t:'קסדה בלבד',c:false,f:'❌ 6 פרמטרים.'}]},
{n:'🏃 חילוץ מוצלח! 3 ניצלו. חוזר לקר.',q:'לפני הפשטה?',opts:[{t:'להוריד',c:false,f:'❌ שטיפה!'},{t:'שטיפה + נעליים',c:true,f:'✅ שטיפה + נעליים בסמיכות.'},{t:'המתנה',c:false,f:'❌ שטיפה פעילה.'}]}
],en:[
{n:'🚨 Sulfuric acid leak (UN 1830) Route 4. Wind W 15km/h. 3 casualties.',q:'First action?',opts:[{t:'🏃 Run to rescue',c:false,f:'❌ No protection! Assessment first.'},{t:'📋 Assess + gather info',c:true,f:'✅ Correct!'},{t:'📞 Backup & wait',c:false,f:'❌ Assessment first.'}]},
{n:'📋 Sulfuric acid — corrosive, not flammable. Rescue 3.',q:'Which suit?',opts:[{t:'🔥 Assault',c:false,f:'❌ For flammables.'},{t:'🛡️ LION ERS',c:true,f:'✅ Corrosive + rescue = ERS.'},{t:'👕 Work clothes',c:false,f:'❌ Acid = full protection.'}]},
{n:'🧥 Chose ERS. Donning.',q:'First?',opts:[{t:'👢 Boots',c:false,f:'❌ Visual inspection!'},{t:'🔍 Visual inspection',c:true,f:'✅ Always first!'},{t:'😷 Mask',c:false,f:'❌ Mask later.'}]},
{n:'✅ Legs, sleeves, boots, tuck. Now mask.',q:'Mask type?',opts:[{t:'Clip-on',c:false,f:'❌ Prohibited!'},{t:'Strap-on',c:true,f:'✅ Iron rule.'},{t:'Any',c:false,f:'❌ Straps only.'}]},
{n:'😷 Donning complete. Team member checks.',q:'Checks what?',opts:[{t:'Zipper only',c:false,f:'❌ 6 parameters!'},{t:'Seal, zip, tuck, gloves, radio, pressure',c:true,f:'✅ Full check.'},{t:'Helmet only',c:false,f:'❌ 6 parameters.'}]},
{n:'🏃 Successful rescue! 3 saved. Back to cold zone.',q:'Before doffing?',opts:[{t:'Just remove',c:false,f:'❌ Must wash!'},{t:'Wash + arrange shoes',c:true,f:'✅ Wash first + shoes nearby.'},{t:'Wait 10 min',c:false,f:'❌ Active washing.'}]}
],zh:[
{n:'🚨 硫酸泄漏(UN 1830)4号公路。西风15km/h。3名伤员。',q:'第一步？',opts:[{t:'🏃 跑去救',c:false,f:'❌ 无防护！先评估。'},{t:'📋 评估+信息',c:true,f:'✅ 正确！'},{t:'📞 等增援',c:false,f:'❌ 先评估。'}]},
{n:'📋 硫酸 — 腐蚀，非燃。救3人。',q:'哪种服？',opts:[{t:'🔥 进攻服',c:false,f:'❌ 用于易燃。'},{t:'🛡️ LION ERS',c:true,f:'✅ 腐蚀+救援=ERS。'},{t:'👕 工作服',c:false,f:'❌ 酸=全防护。'}]},
{n:'🧥 选ERS。穿戴。',q:'第一步？',opts:[{t:'👢 靴子',c:false,f:'❌ 先目视检查！'},{t:'🔍 目视检查',c:true,f:'✅ 始终先检查！'},{t:'😷 面罩',c:false,f:'❌ 面罩在后。'}]},
{n:'✅ 腿、袖、靴、套叠完成。面罩。',q:'面罩类型？',opts:[{t:'卡扣',c:false,f:'❌ 禁止！'},{t:'系带',c:true,f:'✅ 铁律。'},{t:'任何',c:false,f:'❌ 仅系带。'}]},
{n:'😷 穿戴完成。队员检查。',q:'检查什么？',opts:[{t:'仅拉链',c:false,f:'❌ 6项！'},{t:'密封、拉链、套叠、手套、通讯、气压',c:true,f:'✅ 全面检查。'},{t:'仅头盔',c:false,f:'❌ 6项。'}]},
{n:'🏃 救援成功！3人获救。回冷区。',q:'脱卸前？',opts:[{t:'直接脱',c:false,f:'❌ 要洗！'},{t:'洗服+备鞋',c:true,f:'✅ 先洗+备鞋。'},{t:'等10分',c:false,f:'❌ 主动清洗。'}]}
]},
sim_done:{he:['כל הכבוד!','הסימולציה הושלמה בהצלחה.'],en:['Great job!','Simulation completed successfully.'],zh:['做得好！','模拟成功完成。']},
sim_btns:{he:['המשך ←','סיום 🎉','🔄 התחל מחדש'],en:['Continue ←','Finish 🎉','🔄 Start Over'],zh:['继续 ←','完成 🎉','🔄 重新开始']},
// --- Misc ---
score_labels:{he:['ניקוד כולל','פעילויות הושלמו'],en:['Total Score','Activities Completed'],zh:['总分','已完成活动']},
quiz_btns:{he:['הבאה ←','התחל מחדש'],en:['Next ←','Start Over'],zh:['下一题 ←','重新开始']},
quiz_progress:{he:['שאלה','מתוך'],en:['Question','of'],zh:['问题','共']},
quiz_score:{he:['מצוין!','לא רע','חזור על החומר'],en:['Excellent!','Not bad','Review material'],zh:['优秀！','还行','复习材料']},
flash_ui:{he:['לחץ להפוך','כל הכבוד!','🔄 ערבב מחדש','הבא ←'],en:['Click to flip','Well done!','🔄 Shuffle','Next ←'],zh:['点击翻转','做得好！','🔄 重新洗牌','下一 ←']},
drag_ui:{he:['✓ בדוק סדר','↺ אפס','🎉 מושלם!'],en:['✓ Check Order','↺ Reset','🎉 Perfect!'],zh:['✓ 检查','↺ 重置','🎉 完美！']},
footer:{he:['כבאות והצלה לישראל — אגף המבצעים | חטיבת תוה"ד','ס/טפסר רועי צוקרמן, רע"ן חומ"ס ארצי'],en:['Israel Fire & Rescue — Operations Division','S/Sgt Roie Zukerman, National HazMat Officer'],zh:['以色列消防救援 — 作战部','高级中士 Roie Zukerman，国家危险品官员']},
// --- OVERVIEW CONTENT ---
ov:{
purpose_t:{he:'ייעוד החליפה',en:'Suit Purpose',zh:'用途'},
purpose_d:{he:'חליפת LION ERS מספקת הגנה בשני תרחישים:<br><br><strong style="color:var(--fire)">משימות קצרות באזור החם:</strong> הצלת לכודים (Scoop &amp; Run), ייצוב מצב.<br><strong style="color:var(--amber)">פעולות ממושכות באזור הפושר:</strong> שטיפת צוותים, ניטור.',en:'LION ERS provides protection in two scenarios:<br><br><strong style="color:var(--fire)">Short missions in Hot Zone:</strong> Casualty rescue (Scoop &amp; Run), stabilization.<br><strong style="color:var(--amber)">Extended in Warm Zone:</strong> Decon, monitoring.',zh:'LION ERS在两种场景中提供保护：<br><br><strong style="color:var(--fire)">热区短任务：</strong>伤员救援，稳定。<br><strong style="color:var(--amber)">温区长作业：</strong>洗消、监测。'},
prov_h:{he:'✅ מה מספקת',en:'✅ What it provides',zh:'✅ 提供保护'},
prov_l:{he:['הגנה מפני אדים וגזים רעילים/קורוזיביים','הגנה מפני התזת נוזלים','הגנה כימית ומכנית לכפות הידיים','נידוף זיעה (<200 W/m²)','התמגנות והפשטה עצמית'],en:['Protection from toxic/corrosive vapors & gases','Liquid splash protection','Chemical & mechanical hand protection','Sweat evaporation (<200 W/m²)','Self donning & doffing'],zh:['防毒/腐蚀蒸气和气体','防液体飞溅','手部化学和机械保护','排汗 (<200 W/m²)','可自行穿脱']},
not_h:{he:'🚫 לא מיועדת ל:',en:'🚫 NOT for:',zh:'🚫 不适用于：'},
not_l:{he:['גזים/נוזלים דליקים','אש פעילה או להבות','מגע ישיר עם חום/מתכת מותכת','בידוד חשמל','חומר רדיואקטיבי'],en:['Flammable gases/liquids','Active fire or flames','Direct heat/molten metal contact','Electrical insulation','Radioactive materials'],zh:['易燃气体/液体','明火或火焰','直接接触高温/熔融金属','电气绝缘','放射性物质']},
std_h:{he:'📋 תקנים',en:'📋 Standards',zh:'📋 标准'},
std_d:{he:'<strong>NFPA 1992</strong> — הגנה מהתזת נוזלים כימיים.<br><strong>NFPA 1994 Class 3</strong> — הגנה מאדים, גזים, חלקיקים, כולל טרור כימי-ביולוגי.',en:'<strong>NFPA 1992</strong> — Chemical liquid splash protection.<br><strong>NFPA 1994 Class 3</strong> — Vapor, gas & particle protection, incl. CBRN.',zh:'<strong>NFPA 1992</strong> — 化学液体飞溅防护。<br><strong>NFPA 1994 Class 3</strong> — 蒸气、气体、颗粒防护，含CBRN。'},
dl:{he:'📥 מדריך כיס',en:'📥 Pocket Guide',zh:'📥 口袋指南'},
vid:{he:'סרטון הדרכה',en:'Training Video',zh:'培训视频'}
},
// --- COMPONENTS CONTENT ---
cmp:{
warn_h:{he:'⚠️ שימו לב',en:'⚠️ Important',zh:'⚠️ 注意'},
warn_l:{he:['אין מסיכה עם קליפס — רק רצועות','חובה שני סוגי כפפות','הסירו תכשיטים ופריטים אישיים'],en:['No clip mask — straps only','Both glove types required','Remove jewelry & personal items'],zh:['禁卡扣面罩 — 仅系带','必须双层手套','取下首饰']},
hint:{he:'💡 לחץ על כל רכיב בתמונה לפרטים',en:'💡 Click any component for details',zh:'💡 点击查看详情'}
},
// --- MAINTENANCE CONTENT ---
mt:{
cln_t:{he:'ניקוי',en:'Cleaning',zh:'清洁'},
cln_d:{he:'<strong>לאחר שימוש:</strong> מים + סבון עדין, אח"כ מים בלבד.<br><strong>ייבוש:</strong> לא תחת שמש ישירה.<br><strong>אחרי:</strong> קפל → תיק.',en:'<strong>After use:</strong> Water + mild soap, then water only.<br><strong>Drying:</strong> Not in direct sunlight.<br><strong>After:</strong> Fold → bag.',zh:'<strong>使用后：</strong>水+温和肥皂，然后仅水。<br><strong>干燥：</strong>不可直晒。<br><strong>之后：</strong>折叠→装袋。'},
no_h:{he:'🚫 אסור',en:'🚫 Prohibited',zh:'🚫 禁止'},
no_l:{he:['מי חמצן','שמש ישירה בייבוש'],en:['Hydrogen peroxide','Direct sunlight during drying'],zh:['双氧水','干燥时直晒']},
str_t:{he:'אחסון',en:'Storage',zh:'存储'},
str_d:{he:'בשקית, מוצל, ~21°C, לחות 40%.',en:'In bag, shaded, ~21°C, 40% humidity.',zh:'装袋，阴凉，~21°C，湿度40%。'},
ins:{he:['הנח על משטח חלק ומואר','בדיקה חיצונית ופנימית','חיפוש: חתכים, חורים, קרעים, שינוי צבע','בדיקת רוכסן','חוטים רופפים?','פגם → פנה לספק'],en:['Place on smooth lit surface','External & internal inspection','Look for: cuts, holes, tears, discoloration','Check zipper','Loose threads?','Defect → contact supplier'],zh:['放光滑明亮处','内外检查','查：切口、孔洞、撕裂、变色','检查拉链','松线头？','缺陷→联系供应商']},
ins_d:{he:'הפוך חליפה, ברדס, כפפות, גרביים. אין להפוך בטנת כפפה.',en:'Invert suit, hood, gloves, socks. Do NOT invert glove liner.',zh:'翻转服、罩、手套、袜。不可翻内衬。'},
fld:{he:['פרוס — צד חיצוני למעלה','סגור רוכסן + כיסוי','קפל לאורך — ימין על שמאל','שרוולים אקורדיון','גלגל מגרביים לכובע','החזר לשקית'],en:['Spread — outer side up','Close zipper + cover','Fold lengthwise — right over left','Accordion sleeves','Roll socks to hood','Return to bag'],zh:['展开 — 外侧朝上','关拉链+盖板','纵向折 — 右叠左','风琴袖','从袜卷至罩','放回袋']},
sch:{he:['לאחר קבלה מיצרן','לאחר אירוע חומ"ס','1 בכל חודש','לאחר שטיפה וייבוש'],en:['After receiving from manufacturer','After HazMat incident','1st of every month','After washing & drying'],zh:['从制造商接收后','危险品事件后','每月1日','清洗干燥后']},
log:{he:'📝 נהל מעקב: זמן, שטיפות, בדיקות — לכל חיי החליפה.',en:'📝 Track: time, washes, inspections — for suit lifetime.',zh:'📝 记录：时间、清洗、检查 — 贯穿寿命。'}
},
// --- SAFETY CONTENT ---
sf:{
thr_t:{he:'סף שימוש',en:'Usage Threshold',zh:'使用阈值'},
thr_d:{he:'<span style="font-family:\'Frank Ruhl Libre\',serif;font-size:36px;font-weight:900;color:var(--fire)">24</span> שעות <span style="color:var(--warm-300)">או</span> <span style="font-family:\'Frank Ruhl Libre\',serif;font-size:36px;font-weight:900;color:var(--fire)">3</span> שטיפות<br><span style="font-size:12px;color:var(--warm-500)">הראשון מביניהם</span>',en:'<span style="font-family:\'Frank Ruhl Libre\',serif;font-size:36px;font-weight:900;color:var(--fire)">24</span> hours <span style="color:var(--warm-300)">or</span> <span style="font-family:\'Frank Ruhl Libre\',serif;font-size:36px;font-weight:900;color:var(--fire)">3</span> washes<br><span style="font-size:12px;color:var(--warm-500)">whichever comes first</span>',zh:'<span style="font-family:\'Frank Ruhl Libre\',serif;font-size:36px;font-weight:900;color:var(--fire)">24</span> 小时 <span style="color:var(--warm-300)">或</span> <span style="font-family:\'Frank Ruhl Libre\',serif;font-size:36px;font-weight:900;color:var(--fire)">3</span> 次清洗<br><span style="font-size:12px;color:var(--warm-500)">以先到者为准</span>'},
pro_h:{he:'🚫 איסורי שימוש',en:'🚫 Prohibited Uses',zh:'🚫 禁止使用'},
pro_l:{he:['אש פעילה / להבות / קרינה תרמית','גזים/נוזלים דליקים','מגע חום/מתכת מותכת (כפפות)','בידוד חשמל (כפפות)','חומר רדיואקטיבי (כפפות)','חליפה שלא נשטפה/נבדקה/התייבשה'],en:['Active fire / flames / thermal radiation','Flammable gases/liquids','Heat/molten metal contact (gloves)','Electrical insulation (gloves)','Radioactive materials (gloves)','Unwashed/uninspected/undried suit'],zh:['明火/火焰/热辐射','易燃气体/液体','接触高温/熔融金属（手套）','电气绝缘（手套）','放射性物质（手套）','未洗/检/干的服']},
},
// --- DOFF WARN TITLE ---
doff_warn_h:{he:'⚠️ טרם ההפשטה',en:'⚠️ Before Doffing',zh:'⚠️ 脱卸前'}
};// end T

// ============================================================
// APPLY LANGUAGE — Pure DOM manipulation, no main code changes
// ============================================================
function setLang(lang){
  curLang=lang;
  const L=lang;
  const dir=L==='he'?'rtl':'ltr';
  document.documentElement.lang=L;
  document.documentElement.dir=dir;
  
  // NAV
  document.querySelectorAll('#nav a').forEach((a,i)=>{if(T.nav[L][i])a.textContent=T.nav[L][i]});
  
  // HERO
  const hero=document.getElementById('heroArea');
  if(hero){
    hero.querySelector('h1').innerHTML=T.hero_title[L];
    hero.querySelector('.hero-desc').textContent=T.hero_desc[L];
    hero.querySelectorAll('.hero-stat-label').forEach((el,i)=>{el.textContent=T.hero_labels[L][i]});
    hero.querySelectorAll('.unit').forEach((el,i)=>{el.textContent=T.hero_units[L][i]});
  }
  
  // SECTION HEADERS
  document.querySelectorAll('section[id]').forEach(sec=>{
    const id=sec.id;
    const sh=T.sh[L][id];
    if(sh){
      const h=sec.querySelector('.sec-header h2');if(h)h.textContent=sh[0];
      const p=sec.querySelector('.sec-header p');if(p)p.textContent=sh[1];
    }
  });
  
  // COMPONENTS — override global compData
  if(typeof compData!=='undefined'){
    T.comp_names[L].forEach((n,i)=>{compData[i].n=n;compData[i].t=T.comp_descs[L][i]});
    if(typeof initCompBtns==='function')initCompBtns();
  }
  
  // DONNING PREP STEPS
  document.querySelectorAll('#don-prep .step-card').forEach((card,i)=>{
    const d=T.don_prep[L][i];if(!d)return;
    const t=card.querySelector('.step-title');if(t)t.textContent=d[0];
    const desc=card.querySelector('.step-desc');if(desc)desc.textContent=d[1];
  });
  
  // DONNING STEPS
  document.querySelectorAll('#don-steps .step-card').forEach((card,i)=>{
    const d=T.don_steps[L][i];if(!d)return;
    const t=card.querySelector('.step-title');if(t)t.textContent=d[0];
    const desc=card.querySelector('.step-desc');if(desc)desc.textContent=d[1];
    const note=card.querySelector('.step-note');
    if(note&&T.don_notes[i+5])note.textContent=T.don_notes[i+5][L];
  });
  
  // DONNING TABS
  document.querySelectorAll('#donning > .tabs .tab-btn').forEach((b,i)=>{if(T.don_tabs[L][i])b.textContent=T.don_tabs[L][i]});
  
  // DONNING TIMER
  const donSec=document.getElementById('donning');
  if(donSec){
    const ct=donSec.querySelector('.card-title');if(ct)ct.textContent=T.timer[L].title;
    const btns=donSec.querySelectorAll('.timer-controls .btn');
    if(btns[0])btns[0].textContent=T.timer[L].start;
    if(btns[1])btns[1].textContent=T.timer[L].next;
    if(btns[2])btns[2].textContent=T.timer[L].reset;
  }
  
  // DONNING CHECK
  document.querySelectorAll('#don-check .checklist li').forEach((li,i)=>{
    const txt=T.don_check[L][i];if(!txt)return;
    const cb=li.querySelector('.check-box');
    const wasChecked=li.classList.contains('checked');
    li.innerHTML='';li.appendChild(cb);li.appendChild(document.createTextNode(' '+txt));
    if(wasChecked)li.classList.add('checked');
    li.onclick=function(){this.classList.toggle('checked');if(typeof snd==='function')snd(this.classList.contains('checked')?'ok':'tick')};
  });
  
  // DOFFING
  const doffSec=document.getElementById('doffing');
  if(doffSec){
    const warnP=doffSec.querySelector('.alert p');if(warnP)warnP.innerHTML=T.doff_warn[L];
    const btns2=doffSec.querySelectorAll('.timer-controls .btn');
    if(btns2[0])btns2[0].textContent=T.timer[L].start;
    if(btns2[1])btns2[1].textContent=T.timer[L].next;
    if(btns2[2])btns2[2].textContent=T.timer[L].reset;
    const dct=doffSec.querySelector('.card-title');if(dct)dct.textContent=T.timer[L].title;
  }
  document.querySelectorAll('#doffing .step-card').forEach((card,i)=>{
    const d=T.doff_steps[L][i];if(!d)return;
    const t=card.querySelector('.step-title');if(t)t.textContent=d[0];
    const desc=card.querySelector('.step-desc');if(desc)desc.innerHTML=d[1];
    const note=card.querySelector('.step-note');
    if(note&&T.doff_notes[i+1])note.textContent=T.doff_notes[i+1][L];
  });
  
  // TIMER — override global timerData steps
  if(typeof timerData!=='undefined'){
    timerData.don.steps=T.don_prep[L].map(s=>s[0]).concat(T.don_steps[L].map(s=>s[0]));
    timerData.doff.steps=[T.doff_steps[L][0]?T.doff_steps[L][0][0]:'Wash'].concat(T.doff_steps[L].map(s=>s[0]));
    if(typeof initDots==='function'){initDots('don');initDots('doff')}
  }
  
  // DECISION TREE — override globals
  if(typeof dtTree!=='undefined')window.dtTree=T.dtTree[L];
  if(typeof dtResults!=='undefined')window.dtResults=T.dtResults[L];
  
  // SIMULATION — override global
  if(typeof simScenes!=='undefined')window.simScenes=T.simScenes[L];
  
  // MAINTENANCE TABS
  document.querySelectorAll('#maintenance > .tabs .tab-btn').forEach((b,i)=>{if(T.maint_tabs[L][i])b.textContent=T.maint_tabs[L][i]});
  
  // QUIZ SECTION
  const quizSec=document.getElementById('quiz');
  if(quizSec){
    quizSec.querySelectorAll(':scope > .tabs .tab-btn').forEach((b,i)=>{if(T.quiz_tabs[L][i])b.textContent=T.quiz_tabs[L][i]});
    quizSec.querySelectorAll('.score-label').forEach((el,i)=>{el.textContent=T.score_labels[L][i]});
    const nb=document.getElementById('quizNext');if(nb)nb.textContent=T.quiz_btns[L][0];
    const rb=document.getElementById('quizRestart');if(rb)rb.textContent=T.quiz_btns[L][1];
    const fh=quizSec.querySelector('#q-flash > p');if(fh)fh.textContent={he:'לחץ על הכרטיס כדי לגלות את התשובה',en:'Click the card to reveal the answer',zh:'点击卡片查看答案'}[L];
    const fShuf=quizSec.querySelector('#q-flash .btn-outline');if(fShuf)fShuf.textContent=T.flash_ui[L][2];
    const dh=quizSec.querySelector('#q-drag > p');if(dh)dh.textContent={he:'סדר את שלבי ההתמגנות בסדר הנכון — גרור ושחרר',en:'Arrange donning steps in correct order — drag & drop',zh:'将穿戴步骤按正确顺序排列 — 拖放'}[L];
    const dBtns=quizSec.querySelectorAll('#q-drag .btn');if(dBtns[0])dBtns[0].textContent=T.drag_ui[L][0];if(dBtns[1])dBtns[1].textContent=T.drag_ui[L][1];
  }
  const dchk=document.querySelector('#don-check .card-title');
  if(dchk)dchk.textContent={he:'בדיקה סופית',en:'Final Check',zh:'最终检查'}[L];
  
  // Override quiz data
  if(typeof Qs!=='undefined')window.Qs=T.quizData[L];
  if(typeof flashData!=='undefined')window.flashData=T.flashData[L];
  if(typeof dragSteps!=='undefined')window.dragSteps=T.dragSteps[L];
  
  // Reload dynamic content
  try{if(typeof loadQ==='function'){cq=0;sc=0;ans=false;loadQ()}}catch(e){}
  try{if(typeof initFlashcards==='function')initFlashcards()}catch(e){}
  try{if(typeof initDrag==='function')initDrag()}catch(e){}
  
  // --- OVERVIEW CONTENT ---
  const ov=document.getElementById('overview');
  if(ov){
    const cards=ov.querySelectorAll('.card-title');if(cards[0])cards[0].textContent=T.ov.purpose_t[L];
    const texts=ov.querySelectorAll('.card-text');if(texts[0])texts[0].innerHTML=T.ov.purpose_d[L];
    const alerts=ov.querySelectorAll('.alert');
    if(alerts[0]){alerts[0].querySelector('h4').innerHTML=T.ov.prov_h[L];alerts[0].querySelectorAll('li').forEach((li,i)=>{if(T.ov.prov_l[L][i])li.textContent=T.ov.prov_l[L][i]})}
    if(alerts[1]){alerts[1].querySelector('h4').innerHTML=T.ov.not_h[L];alerts[1].querySelectorAll('li').forEach((li,i)=>{if(T.ov.not_l[L][i])li.textContent=T.ov.not_l[L][i]})}
    if(alerts[2]){alerts[2].querySelector('h4').innerHTML=T.ov.std_h[L];const sp=alerts[2].querySelector('p');if(sp)sp.innerHTML=T.ov.std_d[L]}
    const dlBtn=ov.querySelector('.btn-fire');if(dlBtn&&dlBtn.hasAttribute('download'))dlBtn.textContent=T.ov.dl[L];
    if(cards[1])cards[1].textContent=T.ov.vid[L];
  }
  
  // --- COMPONENTS CONTENT ---
  const cmpSec=document.getElementById('components');
  if(cmpSec){
    const hint=cmpSec.querySelector('p[style*="center"]');if(hint)hint.innerHTML=T.cmp.hint[L];
    const alert=cmpSec.querySelector('.alert');
    if(alert){alert.querySelector('h4').innerHTML=T.cmp.warn_h[L];alert.querySelectorAll('li').forEach((li,i)=>{if(T.cmp.warn_l[L][i])li.textContent=T.cmp.warn_l[L][i]})}
  }
  
  // --- MAINTENANCE CONTENT ---
  const mtSec=document.getElementById('maintenance');
  if(mtSec){
    // Cleaning tab
    const clnCards=mtSec.querySelectorAll('#m-clean .card-title');
    if(clnCards[0])clnCards[0].textContent=T.mt.cln_t[L];
    const clnTexts=mtSec.querySelectorAll('#m-clean .card-text');
    if(clnTexts[0])clnTexts[0].innerHTML=T.mt.cln_d[L];
    if(clnCards[1])clnCards[1].textContent=T.mt.str_t[L];
    if(clnTexts[1])clnTexts[1].textContent=T.mt.str_d[L];
    const noAlert=mtSec.querySelector('#m-clean .alert');
    if(noAlert){noAlert.querySelector('h4').innerHTML=T.mt.no_h[L];noAlert.querySelectorAll('li').forEach((li,i)=>{if(T.mt.no_l[L][i])li.textContent=T.mt.no_l[L][i]})}
    // Inspection tab
    mtSec.querySelectorAll('#m-inspect .maint-title').forEach((el,i)=>{if(T.mt.ins[L][i])el.textContent=T.mt.ins[L][i]});
    const insDesc=mtSec.querySelector('#m-inspect .maint-desc');if(insDesc)insDesc.textContent=T.mt.ins_d[L];
    // Fold tab
    mtSec.querySelectorAll('#m-fold .maint-title').forEach((el,i)=>{if(T.mt.fld[L][i])el.textContent=T.mt.fld[L][i]});
    // Schedule tab
    mtSec.querySelectorAll('#m-schedule .maint-title').forEach((el,i)=>{if(T.mt.sch[L][i])el.textContent=T.mt.sch[L][i]});
    const logP=mtSec.querySelector('#m-schedule .alert p');if(logP)logP.textContent=T.mt.log[L];
  }
  
  // --- SAFETY CONTENT ---
  const sfSec=document.getElementById('safety');
  if(sfSec){
    const ct=sfSec.querySelector('.card-title');if(ct)ct.textContent=T.sf.thr_t[L];
    const ctext=sfSec.querySelector('.card-text');if(ctext)ctext.innerHTML=T.sf.thr_d[L];
    const alert=sfSec.querySelector('.alert');
    if(alert){alert.querySelector('h4').innerHTML=T.sf.pro_h[L];alert.querySelectorAll('li').forEach((li,i)=>{if(T.sf.pro_l[L][i])li.textContent=T.sf.pro_l[L][i]})}
  }
  
  // --- DOFFING WARN TITLE ---
  const doffAlert=document.querySelector('#doffing .alert h4');
  if(doffAlert)doffAlert.innerHTML=T.doff_warn_h[L];
  
  // FOOTER
  const ft=document.querySelector('.footer');
  if(ft){const ps=ft.querySelectorAll('p');if(ps[0])ps[0].textContent=T.footer[L][0];if(ps[1])ps[1].textContent=T.footer[L][1]}
}

// Override quiz progress text
const origLoadQ=window.loadQ;
if(origLoadQ){
  window.loadQ=function(){
    origLoadQ();
    const L=curLang;
    const prog=document.getElementById('quizProg');
    if(prog&&T.quiz_progress[L])prog.textContent=T.quiz_progress[L][0]+' '+(cq+1)+' '+T.quiz_progress[L][1]+' '+Qs.length;
  };
  // Re-call to apply
  try{window.loadQ()}catch(e){}
}

// Override quiz score display
const origPickA=window.pickA;
if(origPickA){
  window.pickA=function(i,b){
    origPickA(i,b);
    const L=curLang;
    const sLabel=document.getElementById('sLabel');
    if(sLabel&&sLabel.textContent){
      const p=Math.round(sc/Qs.length*100);
      sLabel.textContent=p>=80?T.quiz_score[L][0]:p>=60?T.quiz_score[L][1]:T.quiz_score[L][2];
    }
    const sVal=document.getElementById('sVal');
    if(sVal&&sVal.textContent)sVal.textContent=sc+'/'+Qs.length;
  };
}

// Override flashcard render
const origRenderFlash=window.renderFlash;
if(origRenderFlash){
  window.renderFlash=function(){
    const L=curLang;
    window.flashData=T.flashData[L];
    origRenderFlash();
    // Fix button text
    const c=document.getElementById('flashContainer');
    if(c){
      const btn=c.querySelector('.btn');if(btn)btn.textContent=T.flash_ui[L][3];
      const flipTxt=c.querySelector('.flashcard-front div div');
      if(flipTxt&&flipTxt.textContent.includes('לחץ'))flipTxt.textContent=T.flash_ui[L][0]+' • '+(flashIdx+1)+'/'+flashData.length;
    }
  };
}

// Override sim button text
const origPickSim=window.pickSim;
if(origPickSim){
  window.pickSim=function(i){
    origPickSim(i);
    const L=curLang;
    const nbtn=document.querySelector('.sim-scene .btn');
    if(nbtn){
      const isLast=simStep>=simScenes.length-1;
      nbtn.textContent=isLast?T.sim_btns[L][1]:T.sim_btns[L][0];
    }
  };
}

// Override sim restart button
const origStartSim=window.startSim;
if(origStartSim){
  window.startSim=function(){
    window.simScenes=T.simScenes[curLang];
    origStartSim();
  };
}

// Override decision tree
const origRenderDT=window.renderDT;
if(origRenderDT){
  window.renderDT=function(idx){
    window.dtTree=T.dtTree[curLang];
    origRenderDT(idx);
  };
}
const origRenderDTResult=window.renderDTResult;
if(origRenderDTResult){
  window.renderDTResult=function(key){
    window.dtResults=T.dtResults[curLang];
    origRenderDTResult(key);
  };
}

// Override sim restart text
const simRestartBtn=document.getElementById('simRestart');
if(simRestartBtn){
  new MutationObserver(()=>{simRestartBtn.textContent=T.sim_btns[curLang][2]}).observe(simRestartBtn,{attributes:true,attributeFilter:['style']});
}

// Override timer step text
const origStartTimer=window.startTimer;
if(origStartTimer){
  window.startTimer=function(type){
    origStartTimer(type);
    const el=document.getElementById(type+'TimerStep');
    if(el)el.textContent=T.timer[curLang].step+' '+(timerData[type].cur+1)+': '+timerData[type].steps[timerData[type].cur];
  };
}
const origNextTimer=window.nextTimerStep;
if(origNextTimer){
  window.nextTimerStep=function(type){
    origNextTimer(type);
    const el=document.getElementById(type+'TimerStep');
    if(el){
      if(timerData[type].cur>=timerData[type].steps.length-1){
        el.innerHTML='<strong style="color:var(--green)">'+T.timer[curLang].done+'</strong>';
      }else{
        el.textContent=T.timer[curLang].step+' '+(timerData[type].cur+1)+': '+timerData[type].steps[timerData[type].cur];
      }
    }
  };
}

})();
