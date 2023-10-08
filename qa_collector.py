# Question-Answer (qa) bank collector
# author: Chisheng Chen

__version__ = "0.0.1"

import re
import json
import requests
from bs4 import BeautifulSoup

# Headers for requesting
headers = {
    'Cookie': "...",  # TODO: filling in your accesing cookies
    'Host': 'learn-sysysb.ynu.edu.cn',
    'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/117.0.0.0 Safari/537.36'
}


def get_all_mock_exams():
    """Returns all the mock exams."""
    url = "https://learn-sysysb.ynu.edu.cn/learn/player/portal/index/mexam_util.jsp"
    data = {'p_num': '32', 'name': '', 'sort_id': '0', 'num': '1'}
    return requests.post(url, data=data, headers=headers).json()


def get_qa(pid, eid, eaid="0"):
    """Returns the qa pairs of a mock exam."""
    url = "https://learn-sysysb.ynu.edu.cn/learn/exam_paper.htm"
    params = {'id': str(pid), 'exam_id': str(eid), 'exam_attempt_id': str(eaid),
              'from': '', 'hk_id': '0', 'hk_type': '', 'object_id': '0', 'c_id': '0',
              'object_type': 'L', 'ec': 'N', 'rp': 'exer'}
    sp = BeautifulSoup(requests.get(url, params=params, headers=headers).text)
    qa_list = {}
    for qa in sp.select("table[id]"):
        title = qa.select_one(".p_qtitle").get_text(strip=True)
        answers = []
        for i, tag in enumerate(qa.select(".p_option_cont")):
            if tag.select_one(".p_right") is not None:
                answers.append(i)
        qa_list[title] = answers
    return qa_list


def collect_qa(vid=0):
    """Collects all the qa pairs of all the mock exams.

    Data formation: 
        {
            // title, list of the answer index
            "火灾初期阶...": [0, 1], 
            ...
        }
    """
    qa_map = {}
    for mock_exam in get_all_mock_exams():
        print(mock_exam["name"])
        eid = mock_exam["id"]
        portal_url = f"https://learn-sysysb.ynu.edu.cn/learn/exam_explain.htm?rp=exer&object_type=L&id={eid}"
        portal_text = requests.get(portal_url, headers=headers).text
        pid = re.findall('pid = "([0-9]+)"', portal_text)[0]
        qa_map[mock_exam["name"]] = get_qa(pid, eid)

    # Mergering all the repeating qa pairs of the qa_map
    # and exporting it to a json file with the name of lab_qa_v{vid}.json
    unique_qa = {}
    for _, v in qa_map.items():
        unique_qa.update(v)
    with open(f"lab_qa_v{vid}.json", "w", encoding="utf-8") as fp:
        json.dump(unique_qa, fp)


if __name__ == '__main__':
    collect_qa(0)
