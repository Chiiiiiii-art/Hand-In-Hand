# -*- coding: utf-8 -*-
text = open('race/攜手基地：以線上遊戲孕育友誼與社會連結.md', encoding='utf-8').read()

# Let's inspect:
# 1. Rubric tags: '（對應社會影響度指標）', '（對應解決方案完整嚴謹度指標）', '（對應執行可實踐性指標）'
# 2. '剝奪' -> '受限' / '困境' / '落差'
# 3. '堅實' -> '穩固的'
# 4. '結構化' -> '規律的' / '固定時長的' / '固定節奏'
# 5. Check if any simplified characters actually exist in the markdown file!

# A precise test for simplified characters:
# Characters that ONLY exist in Simplified Chinese (not standard Traditional Chinese in Big5/CNS11643)
pure_simp_chars = "们这为来国对说会时经当学进种点面实现与关么样两动体长业问机头书门开见给听电变车过还乐亲热办帮产齿处创达单担导灯钓读独夺发罚饭飞费风妇复干个构购顾刮馆广归规还怀坏欢环击级极际济继夹价坚简减鉴将讲奖降街节尽惊竞净局剧决凯考壳宽扩阔赖兰览连联粮量疗辽邻临领刘楼陆录乱轮罗马买卖满门蒙灭难鸟聂宁农齐迁牵铅钱强墙桥乔切轻氢顷庆穷区权让认时实识寿书术树数双顺说丝虽孙态谈弹铁听厅统图团万伪违围卫稳乌无雾务细虾吓显险线县响向项萧写谢勋寻讯压烟严盐阳养尧药爷页医仪异义艺阴隐营拥优犹邮吁语预元园员圆运杂赞脏凿灶则择泽贼赠扎轧战账张掌赵针阵睁郑织职执纸志制治钟终种肿众昼专转庄装状总纵组"
found_simp = []
for i, line in enumerate(text.splitlines()):
    for c in line:
        if c in pure_simp_chars:
            found_simp.append((i+1, c, line))

with open('scratch_audit.txt', 'w', encoding='utf-8') as f:
    f.write(f"Total pure simplified characters found: {len(found_simp)}\n")
    for l, c, line in found_simp:
        f.write(f"Line {l}: '{c}' in {line}\n")
