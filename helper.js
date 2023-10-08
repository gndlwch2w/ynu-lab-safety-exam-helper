// ==UserScript==
// @name     YNU Lab Security Exam Helper
// @include  https://learn-sysysb.ynu.edu.cn/learn/*
// @require  https://cdnjs.cloudflare.com/ajax/libs/jquery/3.5.1/jquery.min.js
// @require  https://cdn.bootcdn.net/ajax/libs/axios/0.21.1/axios.min.js
// @author   Chisheng Chen
// @version  0.0.1
// @license  MIT
// @grant    none
// ==/UserScript==

axios.defaults.baseURL = "..."; // TODO: filling in your base url prefix
axios.defaults.headers.post["Content-Type"] = "application/json";

async function load() {
  if (!window.localStorage.getItem("qa")) {
    await axios.get("lab_qa.json").then((resp) => {
      window.localStorage.setItem("qa", JSON.stringify(resp.data));
    });
  }
}

function answer() {
  const qa_map = JSON.parse(window.localStorage.getItem("qa"));
  $("div.p_paper > table[id]").each(async (_, element) => {
    const title = $(element).find(".p_qtitle")[0];
    const answers = qa_map[title.innerHTML];
    if (!answers) {
      $(title).css("color", "red");
    } else {
      let options = $(element).find(".p_option_cont input");
      $(answers).each((_, e) => {
        $(options[e]).click();
      });
    }
  });
}

$(async function () {
  await load();
  answer();
});
