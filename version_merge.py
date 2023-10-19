import json
import time
from glob import glob


def merge(match_fn="qa_bank/lab_qa_v*.json", out_fn="qa_bank/lab_merged_qa_{version}.json", encoding="utf-8"):
    merged_qa = {}
    for fn in glob(match_fn):
        with open(fn, "r", encoding=encoding) as fp:
            qa = json.load(fp)
            print(f"Number of {fn}: ", len(qa))
            merged_qa.update(qa)
    print('Total number of the qa:', len(merged_qa))
    with open(out_fn.format(version=time.strftime("%Y_%m_%d_%H_%M_%S", time.localtime())), "w", encoding=encoding) as fp:
        json.dump(merged_qa, fp)


if __name__ == '__main__':
    merge()
