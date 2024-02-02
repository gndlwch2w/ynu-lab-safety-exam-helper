// ==UserScript==
// @name     YNU Lab Safety Exam Helper v1.0.0
// @include  https://learn-sysysb.ynu.edu.cn/learn/*
// @require  https://cdnjs.cloudflare.com/ajax/libs/jquery/3.5.1/jquery.min.js
// @author   Chisheng Chen
// @version  1.0.0
// @license  MIT
// @grant    none
// ==/UserScript==

$(() => {
  $("div.p_paper > table[id]").each(async (_, element) => {
    let arr = $(element).find(".p_option .p_option_cont");
    for (let i = 0; i < arr.length; i++) {
      let option = arr[i];
      if ($(option).find("span.p_right").length) {
        $($(option).find("input")[0]).click();
      }
    }
  });
});
  
