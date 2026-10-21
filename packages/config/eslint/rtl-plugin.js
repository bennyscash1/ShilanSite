/**
 * Bans physical-direction Tailwind utilities (ml-, pr-, left-, text-right, ...).
 * The site is RTL-first: use logical utilities (ms-, pe-, start-, text-start, ...).
 */
const PHYSICAL =
  /(?:^|[\s:"'`])-?(?:m[lr]|p[lr]|scroll-m[lr]|scroll-p[lr]|left|right|border-[lr]|rounded-[lr]|rounded-[tb][lr]|text-(?:left|right)|float-(?:left|right)|clear-(?:left|right))(?:-|\b)/;

function check(context, node, value) {
  if (typeof value !== "string" || !PHYSICAL.test(value)) return;
  context.report({
    node,
    message:
      "Physical direction class found. Use logical utilities (ms/me, ps/pe, start/end, text-start/end) for RTL.",
  });
}

export default {
  rules: {
    "no-physical-classes": {
      meta: { type: "problem", schema: [] },
      create(context) {
        return {
          JSXAttribute(node) {
            if (node.name.name !== "className" || node.value?.type !== "Literal") return;
            check(context, node, node.value.value);
          },
          "CallExpression[callee.name=/^(cn|cva|clsx)$/] Literal"(node) {
            check(context, node, node.value);
          },
          "CallExpression[callee.name=/^(cn|cva|clsx)$/] TemplateElement"(node) {
            check(context, node, node.value.cooked);
          },
        };
      },
    },
  },
};
