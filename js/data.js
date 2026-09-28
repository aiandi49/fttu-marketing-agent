/* F.T.T.U Marketing Agent — data.
   The single source of truth for the playbook (guide.html) and the agent
   (index.html). Three ways to get F.T.T.U seen and sold, each answered with the
   5 W's and the money; every product placed on one ladder so you can see where
   it stands. Outside facts were checked against live sources in September 2026:
   "checked" says what was confirmed, "caveat" what was not. Requires js/catalog.js. */
(function (global) {
  var BASE = (global.FTTU && global.FTTU.BASE) || 'https://mlgmigguhljsiopctkkj.supabase.co/storage/v1/object/public/fttu-footwear/';
  var BD = BASE + 'breakdowns/';

  /* The three ways. Keys are used in the agent's MATCH line. */
  var ROUTES = [
    { key: 'organic', short: 'Organic', name: 'Build the audience yourself',
      oneLine: 'Post the designs and the story for free on LinkedIn, Instagram and TikTok, and collect the email of everyone who wants to be first.',
      upfront: 'Nothing but time', speed: 'Months to build', proves: 'Who wants which product', risk: 'Lowest',
      w: {
        who: 'You, posting as the founder. A free email list on Kit. Family and friends sharing \u2014 with a clear note that they\u2019re family.',
        what: 'The story of why F.T.T.U exists, each product\u2019s colorways, the taken-apart views, and one question on every post: which would you wear?',
        when: 'Now. Every design is ready to show as a concept today.',
        where: 'LinkedIn, where your story has already started; Instagram and TikTok for the shoes; a waitlist page that feeds your email list.',
        why: 'It costs nothing and answers the question that decides everything else: which product do people actually want?'
      },
      money: 'Free. Kit\u2019s Newsletter plan is free up to 10,000 subscribers. The real cost is your time.',
      catch: 'Slow, and a like is not an order. An email signup is a stronger signal than a like; a paid pre-order is stronger still.',
      partners: ['linkedin', 'instagram', 'tiktok', 'kit'] },
    { key: 'presale', short: 'Pre-sell', name: 'Pre-sell it before it\u2019s made',
      oneLine: 'Take real orders before anything is made \u2014 on Kickstarter, or through a partner that only makes each item after someone buys it.',
      upfront: 'One real sample', speed: 'Weeks to set up', proves: 'People will pay', risk: 'Medium',
      w: {
        who: 'Kickstarter for a launch campaign; Printful or Zellerfeld for items made after each sale; your email list as the first buyers.',
        what: 'Only what a manufacturing route can actually deliver. Today that means the Printful sneaker, flip-flops and bomber jacket, and a Zellerfeld sneaker once its 3D file exists.',
        when: 'After you hold a real sample and have a list to tell. Not before.',
        where: 'A Kickstarter campaign page, or your own store connected to Printful, or a Zellerfeld marketplace listing.',
        why: 'A paid order is the strongest proof there is. On Kickstarter, if the goal isn\u2019t met, nobody is charged.'
      },
      money: 'Kickstarter takes 5% of a funded campaign plus 3\u20135% payment processing; if the goal is missed, no fees apply and no one is charged. Printful and Zellerfeld charge nothing up front \u2014 their price comes out of each sale.',
      catch: 'Once you take money, you owe delivery. U.S. rules expect you to ship by the date you state \u2014 or within 30 days if you state none \u2014 and to offer a refund when you can\u2019t.',
      partners: ['kickstarter', 'printful', 'zellerfeld'] },
    { key: 'paid', short: 'Paid', name: 'Pay for reach',
      oneLine: 'Pay Instagram, Facebook or TikTok to show a proven post to people who don\u2019t follow you yet, or send product to creators who\u2019ll show it honestly.',
      upfront: 'Your ad budget', speed: 'Days', proves: 'Which message works', risk: 'Highest',
      w: {
        who: 'Meta (Instagram and Facebook ads), TikTok ads, and creators you send product to.',
        what: 'Your best organic post, turned into an ad that sends people to the waitlist or to a live pre-order.',
        when: 'Only after a post has already worked for free, and only when there\u2019s something to join or buy.',
        where: 'Meta Ads Manager, TikTok Ads Manager, and creators\u2019 own accounts.',
        why: 'The fastest way to reach strangers and learn which product and message they respond to.'
      },
      money: 'Meta\u2019s guidance, as reported in 2026, is to start from about $5 a day and run at least six days before judging. Creator fees vary; free product counts as payment and must be disclosed.',
      catch: 'It\u2019s easy to spend money and learn nothing. Realistic AI images need a label on TikTok, and every creator post needs a plain #ad.',
      partners: ['meta', 'tiktokads'] }
  ];

  /* Can I market something that doesn't exist yet? Honest answer, shown first. */
  var DIY = 'Yes \u2014 as long as you market the idea, not a product you can\u2019t ship. Showing concepts, asking which design people want and collecting emails is honest and free, and it is exactly how you find out what to make first. What you can\u2019t do is take money for something no route can deliver, show a render as if it were a photo of a real shoe, or let friends praise it without saying they\u2019re friends. Every way below keeps you on the right side of that line.';

  /* Real organizations. Only facts confirmed in September 2026 are stated. */
  var PARTNERS = [
    { key: 'linkedin', name: 'LinkedIn', route: 'organic', url: 'https://www.linkedin.com/',
      what: 'Where the F.T.T.U founder story already lives: a written post and a swipeable document carousel.',
      checked: 'The F.T.T.U story post and 9-slide carousel were drafted and exported here in September 2026.',
      caveat: 'How much a link in the post cuts reach is disputed; estimates vary widely.' },
    { key: 'instagram', name: 'Instagram', route: 'organic', url: 'https://www.instagram.com/',
      what: 'Photo and short-video app \u2014 the natural home for colorway carousels and seasonal drops.',
      checked: 'Free to post; paid reach runs through Meta\u2019s ad tools (see Pay for reach).',
      caveat: 'Formats and sizes change; check the current spec before you design a post.' },
    { key: 'tiktok', name: 'TikTok', route: 'organic', url: 'https://www.tiktok.com/',
      what: 'Short video. Best for the founder talking to camera and for \u201cwatch it come apart\u201d breakdown clips.',
      checked: 'TikTok\u2019s own rules require a label on realistic AI-generated content.',
      caveat: 'Exactly which edits count as \u201crealistic\u201d is left to TikTok; label when in doubt.' },
    { key: 'kit', name: 'Kit (email list)', route: 'organic', url: 'https://kit.com/',
      what: 'Email-list tool for creators (formerly ConvertKit) with sign-up forms and landing pages.',
      checked: 'Free Newsletter plan up to 10,000 subscribers \u2014 several 2026 pricing reviews agree.',
      caveat: 'From pricing reviews, not Kit\u2019s own page; the free plan limits automations.' },
    { key: 'kickstarter', name: 'Kickstarter', route: 'presale', url: 'https://www.kickstarter.com/help/fees',
      what: 'All-or-nothing crowdfunding: backers pledge, and cards are charged only if the goal is reached.',
      checked: '5% fee on funded projects plus 3\u20135% payment processing, per Kickstarter\u2019s own fees page.',
      caveat: 'Shipping, taxes and failed payments are extra and on you.' },
    { key: 'printful', name: 'Printful', route: 'presale', url: 'https://www.printful.com/custom-shoes',
      what: 'Print-on-demand: F.T.T.U artwork on their shoes, flip-flops and bomber jacket, made after each sale through a store you connect.',
      checked: 'No order minimums (checked for the manufacturing agent, September 2026).',
      caveat: 'Stock shapes with printed artwork \u2014 not the knit design. Say so in the listing.' },
    { key: 'zellerfeld', name: 'Zellerfeld', route: 'presale', url: 'https://www.zellerfeld.com/',
      what: '3D-printed footwear marketplace where independent designers list shoes and set their own prices.',
      checked: 'Marketplace relaunched July 21, 2026 (checked for the manufacturing agent).',
      caveat: 'Needs a printable 3D model first \u2014 nothing to list until then.' },
    { key: 'meta', name: 'Meta ads (Instagram + Facebook)', route: 'paid', url: 'https://www.facebook.com/business/ads',
      what: 'Paid reach on Instagram and Facebook, from boosting one post to full campaigns.',
      checked: 'Starting guidance of about $5 a day for 6+ days, as reported by 2026 guides citing Meta\u2019s pricing page.',
      caveat: 'Meta\u2019s own page was not opened here; results and costs vary widely.' },
    { key: 'tiktokads', name: 'TikTok ads', route: 'paid', url: 'https://ads.tiktok.com/',
      what: 'Paid reach on TikTok, including boosting your own videos.',
      checked: 'A July 21, 2026 ad-policy update requiring AI-disclosure labels on ads, as reported by an ad agency.',
      caveat: 'Reported secondhand; confirm in TikTok\u2019s ad policies. Minimum budgets not verified.' },
    { key: 'hub', name: 'F.T.T.U Hub', route: 'help', url: 'https://fttu-hub.vercel.app',
      what: 'Your own directory of verified Black-owned banks and farms \u2014 the reason F.T.T.U exists, and the first place its story should point.',
      checked: 'Part of the same F.T.T.U build; linked from your September 2026 LinkedIn post.',
      caveat: 'Live site not opened from here.' },
    { key: 'obws', name: 'Official Black Wall Street', route: 'help', url: 'https://nextcity.org/urbanist-news/app-helps-users-support-black-owned-businesses',
      what: 'A directory and app for finding Black-owned businesses; owners can claim or submit a listing.',
      checked: 'Founded 2015 by Mandy Bowman; the app lets owners claim listings and post offers.',
      caveat: 'The link goes to a news story about it; its current site, activity and listing terms in 2026 were not confirmed.' },
    { key: 'target', name: 'Target Accelerators', route: 'help', url: 'https://corporate.target.com/news-features/article/2026/02/black-designers',
      what: 'Target\u2019s programs for emerging founders (Target Takeoff, Target Forward Founders), plus year-round partnerships with Black-owned brands.',
      checked: 'Target says it partners with Black-owned brands year-round, including apparel and accessories (February 2026).',
      caveat: 'Takeoff favors brands already selling, mostly food and household goods. A later goal, not a first step.' }
  ];

  /* Where a product stands. One ladder for the whole line. */
  var LADDER = [
    { key: 'concept', label: 'Concept', means: 'Renders only. Nobody outside your circle has weighed in yet.' },
    { key: 'tested', label: 'Tested', means: 'Shown cold to people outside your circle; you know what they see and which colorway they pick.' },
    { key: 'waitlist', label: 'Waitlist', means: 'Real people left their email to hear when it\u2019s ready.' },
    { key: 'presale', label: 'Pre-selling', means: 'People have paid before it\u2019s made, with a ship date you can keep.' },
    { key: 'selling', label: 'Selling', means: 'It ships when ordered.' }
  ];

  /* How each product looks through each route: [fit, what it means].
     fit: yes = ready; maybe = with care; no = not yet. */
  var FIT = {
    'sneakers':     { organic: ['yes', 'The lead product: five colorways and a taken-apart view to post today.'], presale: ['yes', 'The Printful printed sneaker can be pre-sold once you hold a sample; the knit version can\u2019t yet.'], paid: ['maybe', 'Once one post clearly works and there\u2019s a waitlist or pre-order to send people to.'] },
    'boots':        { organic: ['yes', 'Five seasonal colorways \u2014 strong for a fall and winter series.'], presale: ['maybe', 'Only as a Printful high-top stand-in, labeled as a stand-in.'], paid: ['no', 'Nothing to buy yet; grow the waitlist for free first.'] },
    'sandals':      { organic: ['yes', 'Six colorways, including a bonus ice-blue \u2014 the widest range in the line.'], presale: ['maybe', 'Only as Printful printed slides, labeled as a stand-in for the strap sandal.'], paid: ['no', 'Nothing to buy yet; grow the waitlist for free first.'] },
    'flip-flops':   { organic: ['yes', 'Five colorways and the simplest build in the line.'], presale: ['yes', 'Printful flip-flops can be pre-sold once you hold a sample \u2014 the cheapest first sale.'], paid: ['maybe', 'A small test once a pre-order is live.'] },
    'high-heels':   { organic: ['yes', 'Post as a concept and ask who would wear it.'], presale: ['no', 'Factory only, and no factory route yet.'], paid: ['no', 'Nothing to buy yet.'] },
    'hiking-boots': { organic: ['yes', 'Post as a concept; don\u2019t call it waterproof.'], presale: ['no', 'Factory only, and no factory route yet.'], paid: ['no', 'Nothing to buy yet.'] },
    'kids':         { organic: ['maybe', 'Show it to parents as a concept; never collect children\u2019s information.'], presale: ['no', 'Can\u2019t be sold until children\u2019s product testing and a certificate are done.'], paid: ['no', 'Not until it can be sold legally.'] },
    'baby-shoes':   { organic: ['maybe', 'Show it to parents as a concept; never collect children\u2019s information.'], presale: ['no', 'Can\u2019t be sold until children\u2019s product testing and a certificate are done.'], paid: ['no', 'Not until it can be sold legally.'] },
    'snowboard':    { organic: ['yes', 'Eye-catching concept art for reach \u2014 say plainly it\u2019s a concept.'], presale: ['no', 'No verified board factory.'], paid: ['no', 'Nothing to buy yet.'] },
    'skis':         { organic: ['yes', 'Eye-catching concept art for reach \u2014 say plainly it\u2019s a concept.'], presale: ['no', 'No verified ski factory, and bindings must come from a certified maker.'], paid: ['no', 'Nothing to buy yet.'] },
    'apparel':      { organic: ['yes', 'The piece people already ask to buy \u2014 lead with that.'], presale: ['yes', 'The Printful bomber can be pre-sold to the people who asked, once you hold a sample.'], paid: ['maybe', 'After the first pre-orders, with permission from anyone pictured.'] }
  };

  /* Every product through a marketing lens.
     stage: a LADDER key. signal: real demand so far. makeable: the fastest real
     route from the manufacturing agent. ideas: three posts to make. */
  var PRODUCTS = [
    { key: 'sneakers', label: 'Sneaker', breakdown: BD + 'sneaker.jpg', stage: 'concept',
      angle: 'The first F.T.T.U design \u2014 made for everyone, with nothing borrowed from anyone.',
      audience: 'Everyday sneaker wearers, and people following the founder\u2019s story.',
      signal: 'None collected yet.',
      makeable: 'Printful printed sneaker now; Zellerfeld once a 3D file exists; the knit version needs a factory.',
      ideas: ['Which season would you wear? All five colorways in one carousel, one question.', 'Taken apart: the eleven parts inside one sneaker, from knit upper to outsole.', 'Why \u201cFrom Them To Us\u201d \u2014 the founder, one minute, on camera.'] },
    { key: 'boots', label: 'Sneaker boot', breakdown: BD + 'boot.jpg', stage: 'concept',
      angle: 'The sneaker, grown up for cold weather.',
      audience: 'Fall and winter buyers who already like the sneaker.',
      signal: 'None collected yet.',
      makeable: 'Factory only for the real boot; a Printful high-top can stand in.',
      ideas: ['Winter teaser: the snow-dusted navy boot, one line of copy.', 'Same DNA: the sneaker and the boot side by side.', 'Vote: which boot colorway leads this fall?'] },
    { key: 'sandals', label: 'Sandal', breakdown: BD + 'sandal.jpg', stage: 'concept',
      angle: 'Six colorways, including a bonus ice-blue \u2014 the most range in the line.',
      audience: 'Warm-weather buyers; the Caribbean-palette crowd.',
      signal: 'None collected yet.',
      makeable: 'Factory for the strap sandal; Printful slides can stand in.',
      ideas: ['Six sandals, one tap: the full colorway lineup.', 'The shield badge up close \u2014 what it stands for.', 'Summer countdown: sign up to hear first.'] },
    { key: 'flip-flops', label: 'Flip-flop', breakdown: BD + 'ff.jpg', stage: 'concept',
      angle: 'The fewest parts, the lowest price, the easiest first sale.',
      audience: 'Anyone \u2014 the lowest-risk first purchase in the line.',
      signal: 'None collected yet.',
      makeable: 'Printful flip-flops now.',
      ideas: ['Six parts. That\u2019s it. The simplest F.T.T.U, taken apart.', 'Five seasons of flip-flops \u2014 which one first?', 'First F.T.T.U you can actually own: sign up for the drop.'] },
    { key: 'high-heels', label: 'Heel', breakdown: BD + 'hh.jpg', stage: 'concept',
      angle: 'The line isn\u2019t just sneakers \u2014 F.T.T.U dresses up too.',
      audience: 'Women who follow the brand; event and occasion buyers.',
      signal: 'None collected yet.',
      makeable: 'Factory only.',
      ideas: ['Five seasons of heels in one carousel.', 'Would you wear it? One heel, one honest question.', 'From sneaker to heel: how one design language stretches.'] },
    { key: 'hiking-boots', label: 'Hiking boot', breakdown: BD + 'hiking.jpg', stage: 'concept',
      angle: 'F.T.T.U goes outside.',
      audience: 'Weekend hikers and outdoor families.',
      signal: 'None collected yet.',
      makeable: 'Factory only.',
      ideas: ['Built for the trail: the hiking boot taken apart.', 'Where would you take these first?', 'The whole F.T.T.U family, from flip-flop to hiking boot.'] },
    { key: 'kids', label: 'Kids\u2019 sneaker', breakdown: BD + 'kids.jpg', stage: 'concept',
      angle: 'We can\u2019t leave the kids out.',
      audience: 'Parents and grandparents \u2014 never children directly.',
      signal: 'None collected yet.',
      makeable: 'Factory only, plus required children\u2019s product testing.',
      ideas: ['For the little ones: the kids\u2019 sneaker, shown to parents.', 'Toggle laces and a star badge \u2014 the details parents ask about.', 'Parents: sign up and we\u2019ll tell you when it\u2019s tested and ready.'] },
    { key: 'baby-shoes', label: 'Baby shoe', breakdown: BD + 'baby.jpg', stage: 'concept',
      angle: 'And the little bambinos, too.',
      audience: 'New parents and gift-givers.',
      signal: 'None collected yet.',
      makeable: 'Factory only, plus required children\u2019s product testing.',
      ideas: ['First steps in F.T.T.U \u2014 a concept for new parents.', 'Soft sole, one strap: the baby shoe taken apart.', 'Baby-shower gift list: sign up to hear when it\u2019s ready.'] },
    { key: 'snowboard', label: 'Snowboard', breakdown: BD + 'snowboard.jpg', stage: 'concept',
      angle: 'How far a shoe brand\u2019s look can travel.',
      audience: 'Winter-sports fans; people who share bold design.',
      signal: 'None collected yet.',
      makeable: 'No verified factory; graphics on an existing board shape come first.',
      ideas: ['F.T.T.U on the mountain \u2014 a concept, clearly labeled.', 'Inside a snowboard: nine parts, one graphic.', 'Should F.T.T.U go this far? Tell us.'] },
    { key: 'skis', label: 'Skis', breakdown: BD + 'skis.jpg', stage: 'concept',
      angle: 'The brand on the slopes.',
      audience: 'Skiers and winter-sports fans.',
      signal: 'None collected yet.',
      makeable: 'No verified factory; bindings must come from a certified maker.',
      ideas: ['F.T.T.U skis \u2014 a concept, clearly labeled.', 'Sneakers to skis: the full range in one post.', 'Snowboard or skis \u2014 which one first?'] },
    { key: 'apparel', label: 'Track jacket', breakdown: BD + 'jacket.jpg', stage: 'concept',
      angle: 'The piece family and friends asked to buy on the spot.',
      audience: 'The founder\u2019s circle first, then anyone who follows the brand.',
      signal: 'Five people asking to buy it (the founder\u2019s count, September 2026).',
      makeable: 'Printful bomber now; the cut-and-sew track jacket needs a factory.',
      ideas: ['Five people asked for this before it existed. Here\u2019s why.', 'The track jacket taken apart: shell, rib, zip, patch.', 'First run: sign up \u2014 the people who asked go first.'] }
  ];

  /* Rules that apply whichever way is chosen. */
  var RULES = [
    { key: 'eyes', title: 'Many eyes before anything goes out',
      body: 'Show every design, post and ad cold to a few different people before it\u2019s public, and ask what they see. F.T.T.U exists because an ad went out that nobody caught. Don\u2019t repeat that.', applies: 'all' },
    { key: 'concept', title: 'Say \u201cconcept\u201d until it\u2019s real',
      body: 'Every F.T.T.U image is an AI render. Call it a concept, never show it as a product photo, and never imply it\u2019s in stock.', applies: 'all' },
    { key: 'fake', title: 'No fake reviews, followers or testimonials',
      body: 'A 2024 FTC rule bans fake and AI-written reviews and testimonials and buying fake followers or views, with civil penalties. Only real people, saying what really happened.', applies: 'all' },
    { key: 'disclose', title: 'Family, friends and creators must say so',
      body: 'Under FTC guidance, a family, work or money relationship \u2014 including free product \u2014 has to be disclosed plainly: \u201c#ad\u201d, \u201cmy brother\u2019s brand\u201d, \u201cthey sent me this.\u201d', applies: 'all' },
    { key: 'preorder', title: 'A pre-order is a shipping promise',
      body: 'Under the FTC\u2019s order rule, ship by the date you state \u2014 or within 30 days if you state none. If you\u2019ll be late, ask the buyer to accept the delay or refund them promptly.', applies: 'all' },
    { key: 'ai', title: 'Label realistic AI images',
      body: 'TikTok requires a label on realistic AI-generated content, and it\u2019s the honest thing to do everywhere. AI edits of real people always get a label.', applies: 'all' },
    { key: 'claims', title: 'Only claim what you can prove',
      body: 'Words like waterproof, eco-friendly or made in USA need proof before they appear in a post or listing.', applies: 'all' },
    { key: 'people', title: 'Get permission from anyone pictured',
      body: 'The jacket photos show real family and friends with the jacket added by AI. Get each person\u2019s written OK before posting, and label them as AI edits.', applies: ['apparel'] },
    { key: 'kids', title: 'Talk to parents, not children',
      body: 'Market kids\u2019 and baby shoes to adults. Don\u2019t collect personal information from children under 13 (COPPA), and don\u2019t sell until children\u2019s product testing and a certificate are done.', applies: ['kids', 'baby-shoes'] },
    { key: 'trademark', title: 'Clear the name before you spend on it',
      body: 'Search F.T.T.U and the shield in the USPTO trademark database before paying for ads, packaging or a campaign built on the name.', applies: 'all' }
  ];

  /* The path, in order: prove demand for free, then ask for money. */
  var STAGES = [
    { title: 'Start the list', body: 'Put up a waitlist page that feeds a free Kit list. Link it from the LinkedIn story and your bio.', route: 'organic' },
    { title: 'Ask, don\u2019t sell', body: 'One product a week, one question: which would you wear? Count signups per product, not likes.', route: 'organic' },
    { title: 'Many eyes', body: 'Before each post, show it cold to a few different people. Fix anything they misread.', route: 'organic' },
    { title: 'Hand off to manufacturing', body: 'The product with the most signups goes to your manufacturing agent for a real sample.', route: 'presale' },
    { title: 'Pre-sell to the list', body: 'Open pre-orders to the people who asked first \u2014 starting with the jacket \u2014 with a ship date you can keep.', route: 'presale' },
    { title: 'Pay to scale what works', body: 'Put a small budget behind the post that already worked, pointed at the live pre-order.', route: 'paid' }
  ];

  /* Five official sources to read. Existence and content confirmed September 2026. */
  var READS = [
    { title: 'Disclosures 101 for Social Media Influencers', who: 'Federal Trade Commission', url: 'https://www.ftc.gov/business-guidance/blog/2019/11/disclosures-101-new-ftc-resources-social-media-influencers', route: 'paid',
      why: 'A ten-minute read on when family, friends and creators have to say they\u2019re connected to you, and exactly what wording works.' },
    { title: 'Business Guide to the Mail, Internet or Telephone Order Merchandise Rule', who: 'Federal Trade Commission', url: 'https://ftc.gov/business-guidance/resources/business-guide-ftcs-mail-internet-or-telephone-order-merchandise-rule', route: 'presale',
      why: 'The \u201c30-day rule\u201d behind every pre-order: what a ship date promises and what to do if you\u2019re late.' },
    { title: 'Final rule banning fake reviews and testimonials', who: 'Federal Trade Commission', url: 'https://www.ftc.gov/news-events/news/press-releases/2024/08/federal-trade-commission-announces-final-rule-banning-fake-reviews-testimonials', route: 'organic',
      why: 'Why AI-written reviews, bought followers and insider praise without disclosure are off the table.' },
    { title: 'When and how should I start planning my promotion strategy?', who: 'Kickstarter Help Center', url: 'https://help.kickstarter.com/en-us/articles/16236407-when-and-how-should-i-start-planning-my-promotion-strategy', route: 'presale',
      why: 'Kickstarter\u2019s own advice: start with the people you already know and a contact list, long before launch.' },
    { title: 'Fees: United States', who: 'Kickstarter', url: 'https://www.kickstarter.com/help/fees', route: 'presale',
      why: 'The exact cut Kickstarter and its payment processor take, straight from the source.' }
  ];

  function by(list, key) { for (var i = 0; i < list.length; i++) if (list[i].key === key) return list[i]; return null; }
  PRODUCTS.forEach(function (p) { p.fit = FIT[p.key]; });

  global.FTTU_MKT = {
    ROUTES: ROUTES, PARTNERS: PARTNERS, PRODUCTS: PRODUCTS, RULES: RULES, STAGES: STAGES, READS: READS, LADDER: LADDER, DIY: DIY,
    route: function (k) { return by(ROUTES, k); },
    partner: function (k) { return by(PARTNERS, k); },
    product: function (k) { return by(PRODUCTS, k); },
    rung: function (k) { for (var i = 0; i < LADDER.length; i++) if (LADDER[i].key === k) return i; return 0; },
    rulesFor: function (k) { return RULES.filter(function (r) { return r.applies === 'all' || r.applies.indexOf(k) > -1; }); },
    CHECKED: 'September 2026'
  };
})(window);
