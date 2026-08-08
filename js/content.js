/*
  content.js
  ----------
  This file is the single source of truth for every piece of editable text
  on the website. The site (index.html) and the content editor (admin.html)
  both read from `window.DEFAULT_CONTENT`.

  HOW EDITING WORKS
  1. Open admin.html in your browser, edit any field, click "Save Changes".
     Your edits are stored in the browser (localStorage) and instantly show
     up on index.html the next time you load it in the SAME browser.
  2. To make your edits permanent (and visible to everyone, on any browser/
     device), click "Download content.js" in the editor and replace this
     file with the downloaded one.

  You can also edit the text directly below by hand -- it is a plain
  JavaScript object, safe to open in any text editor.
*/

window.DEFAULT_CONTENT = {
  "meta": {
    "siteName": "theblackbird.ai",
    "tagline": "SOAR",
    "themeColor": "#0a0a0b"
  },
  "nav": {
    "ctaLabel": "Let's Talk",
    "ctaHref": "#contact",
    "links": [
      { "label": "About", "href": "#about" },
      { "label": "Services", "href": "#services" },
      { "label": "Contact", "href": "#contact" }
    ]
  },
  "hero": {
    "eyebrow": "theblackbird.ai",
    "heading": "Question. Solve. Build.",
    "subheading": "We're Blackbird \u2014 strategic advisors and technology builders who help businesses turn AI's rare moment of reinvention into a lasting advantage.",
    "primaryCtaLabel": "Let's Talk",
    "primaryCtaHref": "#contact",
    "secondaryCtaLabel": "Discover our story",
    "secondaryCtaHref": "#about"
  },
  "industries": {
    "heading": "Where We Fly",
    "subheading": "Trusted by teams rethinking what their business could become.",
    "items": [
      "Financial Services",
      "Healthcare & Life Sciences",
      "Manufacturing & Industrial",
      "Retail & CPG",
      "Public Sector",
      "Technology & SaaS"
    ]
  },
  "about": {
    "eyebrow": "About Us",
    "heading": "Hello. We\u2019re Blackbird.",
    "paragraphs": [
      "Before we tell you what we do, perhaps we should tell you what we believe. Because if our beliefs don\u2019t align, our services probably won\u2019t matter. We believe good business begins with doing the right thing. Even when it means leaving business on the table. Even when the easier answer is to sell another service, another product, another year of work. If you don\u2019t need it, we\u2019d rather tell you.",
      "No fine prints here.",
      "Still with us? Good.",
      "Then there\u2019s something else you should know. We ask a lot of questions. Why does this process exist? Why does this system still exist? Why are ten people doing something technology could simplify? Why are we modernizing yesterday\u2019s architecture instead of reconsidering it?",
      "And, perhaps most importantly: if we were starting today, would we build it this way?",
      "Questioning the status quo isn\u2019t disruption for its own sake. It is curiosity with a purpose.",
      "Here\u2019s where our interests become a little unusual.",
      "We\u2019re less interested in how much of your technology budget we can capture. We\u2019re much more interested in your P&L.",
      "Can we help you make more? Can we help you spend less where spending adds little value? Can technology create a new source of revenue? Can AI change the economics of a process\u2014not merely automate a few steps? Can something that was once a cost center become an advantage?",
      "That is a much more interesting conversation to us.",
      "We want to participate in the value we create, not simply the budget you spend.",
      "And then came AI.",
      "AI gives businesses a rare opportunity. Not simply to add another technology layer. But to look again \u2014 at the applications accumulated over decades, at the processes everyone stopped questioning, at the data sitting between systems, at the work people perform simply because \u201cthat\u2019s how we do it.\u201d",
      "We invite our clients to look at that landscape with fresh eyes.",
      "If AI existed when you designed your enterprise, what would you build differently?",
      "That question is where some of our most interesting conversations begin.",
      "But new doesn\u2019t automatically mean better.",
      "We like experimentation. We love curiosity. But we believe in building to last.",
      "Architecture should endure. Products should solve real problems. Technology should earn its place. And companies should be built around principles that survive technology cycles.",
      "That is why we can be enthusiastic about AI without being intoxicated by it.",
      "The destination matters more than the trend.",
      "People come first.",
      "We believe in something that may sound counterintuitive: employees first, customers second.",
      "Because extraordinary customer experiences rarely come from unhappy, uninspired people.",
      "Take care of good people. Give them trust. Give them room to question. Let them experiment. Let them disagree. Let them care deeply about the work. They will take care of customers.",
      "It is remarkably simple.",
      "Perhaps you\u2019re wondering who we want to work with.",
      "Not everyone. And we think that\u2019s healthy.",
      "We want partners who are driven by purpose before another buck. Leaders willing to question assumptions. Organizations willing to rethink rather than simply replace.",
      "People who can imagine what their business could become\u2014not merely what next year\u2019s technology roadmap says it should become. People willing to spread their wings before the path is completely obvious.",
      "Because meaningful change has always required a little courage.",
      "If that sounds like you\u2026",
      "Pull up a chair. Bring us the difficult problem. The one that has survived three transformations. The one everyone has learned to live with. The idea somebody once dismissed as impossible.",
      "Let\u2019s question it together. Let\u2019s strip away the assumptions. Let\u2019s see what AI changes\u2014and what it doesn\u2019t. And then, if there is something worth building, let\u2019s build it to last.",
      "Flock with the Blackbird."
    ],
    "closingLine": "Question. Solve. Build."
  },
  "services": {
    "eyebrow": "Services",
    "heading": "We advise. We build. We enable.",
    "subheading": "From possibility to progress. Blackbird combines strategic advisory, industry expertise, and technology to help businesses solve meaningful problems and build what comes next. Our services help organizations navigate transformation and accelerate growth, while our products turn emerging technologies into practical, scalable solutions.",
    "pillars": [
      {
        "title": "Advise",
        "description": "Strategic advisory and deep industry expertise that help you cut through complexity and navigate transformation with clarity.",
        "icon": "compass"
      },
      {
        "title": "Build",
        "description": "Technology and products engineered to turn emerging capabilities \u2014 like AI \u2014 into practical, scalable solutions built to last.",
        "icon": "cube"
      },
      {
        "title": "Enable",
        "description": "Hands-on partnership that accelerates growth and turns bold ideas into a durable, measurable business advantage.",
        "icon": "spark"
      }
    ]
  },
  "timeline": {
    "eyebrow": "How We Work",
    "heading": "A simple process for hard problems.",
    "steps": [
      {
        "number": "01",
        "title": "Question",
        "description": "We start by asking why. Why this process, why this system, why now. We challenge assumptions before we touch a single line of code."
      },
      {
        "number": "02",
        "title": "Solve",
        "description": "We strip away what doesn\u2019t serve the business and design a path that is grounded in your P&L, not just your tech stack."
      },
      {
        "number": "03",
        "title": "Build",
        "description": "We build to last \u2014 architecture that endures, products that solve real problems, and outcomes you can measure."
      }
    ]
  },
  "closing": {
    "heading": "Bring us the difficult problem.",
    "subheading": "The one that has survived three transformations. The one everyone has learned to live with. Let\u2019s question it together \u2014 and build what comes next, to last.",
    "ctaLabel": "Start the Conversation",
    "ctaHref": "#contact"
  },
  "contact": {
    "eyebrow": "Contact",
    "heading": "Let\u2019s Talk",
    "subheading": "Pull up a chair. Tell us about the problem no one else has been able to solve.",
    "email": "hello@theblackbird.ai",
    "ctaLabel": "Send Message",
    "formNamePlaceholder": "Your name",
    "formEmailPlaceholder": "Email address",
    "formMessagePlaceholder": "Tell us about your business challenge"
  },
  "footer": {
    "tagline": "SOAR",
    "description": "Question. Solve. Build.",
    "copyright": "\u00a9 {year} theblackbird.ai. All rights reserved.",
    "links": [
      { "label": "Privacy Policy", "href": "#" },
      { "label": "Terms of Service", "href": "#" }
    ],
    "social": [
      { "label": "LinkedIn", "href": "#", "icon": "linkedin" },
      { "label": "X", "href": "#", "icon": "x" },
      { "label": "Instagram", "href": "#", "icon": "instagram" }
    ]
  }
};
