// ==UserScript==
// @name     YNU Lab Safety Exam Helper
// @include  https://learn-sysysb.ynu.edu.cn/learn/*
// @require  https://cdnjs.cloudflare.com/ajax/libs/jquery/3.5.1/jquery.min.js
// @require  https://cdn.bootcdn.net/ajax/libs/axios/0.21.1/axios.min.js
// @author   Chisheng Chen
// @version  0.0.1
// @license  MIT
// @grant    none
// ==/UserScript==

var similiarity_threshold = 0.9;

axios.defaults.baseURL = "..."; // TODO: filling in your base url prefix
axios.defaults.headers.post["Content-Type"] = "application/json";

function lcs_length(s1, s2) {
  if (s1.length == 0 || s2.length == 0) return 0;
  if (s1[0] == s2[0]) return 1 + lcs_length(s1.substr(1), s2.substr(1));
  else return Math.max(lcs_length(s1.substr(1), s2), lcs_length(s1, s2.substr(1)));
}

async function load() {
  if (!window.localStorage.getItem("qa")) {
    await axios.get("lab_qa.json").then((resp) => {
      window.localStorage.setItem("qa", JSON.stringify(resp.data));
    });
  }
}

function answer() {
  const unanswerd = [];
  const qa_map = JSON.parse(window.localStorage.getItem("qa"));

  // step 1
  $("div.p_paper > table[id]").each(async (_, element) => {
    const title = $(element).find(".p_qtitle")[0];
    const answers = qa_map[title.innerHTML];
    if (!answers) {
      $(title).css("color", "red");
      unanswerd.push(element);
    } else {
      let options = $(element).find(".p_option_cont input");
      $(answers).each((_, e) => {
        $(options[e]).click();
      });
    }
  });

  // step 2
  unanswerd.each((_, element) => {
    const title = $(element).find(".p_qtitle")[0];
    for (let key in qa_map) {
      const similarity = lcs_length(title, key) / title.length;
      if (similarity >= similiarity_threshold) {
        $(title).css("color", "orange");
        let options = $(element).find(".p_option_cont input");
        $(qa_map[key]).each((_, e) => {
          $(options[e]).click();
        });
        break;
      }
    }
  });
}

$(async function () {
  await load();
  answer();
});
