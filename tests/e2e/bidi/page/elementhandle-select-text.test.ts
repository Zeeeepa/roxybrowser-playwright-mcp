import { describe, expect, it } from "vitest";
import { withBidiPage } from "../../../helpers/bidi.js";

describe("elementHandle selectText e2e (bidi/firefox)", () => {
  it("should select input text", async () => {
    await withBidiPage(async (page) => {
      await page.setContent('<input value="some value">');
      const input = await page.$("input");

      await input!.selectText();

      expect(await page.evaluate(() => {
        const element = document.querySelector("input") as HTMLInputElement;
        return {
          selectionStart: element.selectionStart,
          selectionEnd: element.selectionEnd,
          active: document.activeElement === element,
          hasFocus: document.hasFocus()
        };
      })).toEqual({
        selectionStart: 0,
        selectionEnd: 10,
        active: true,
        hasFocus: false
      });
    });
  });

  it("should follow label control", async () => {
    await withBidiPage(async (page) => {
      await page.setContent(`<label>Label text <input value="some value"></label>`);
      const label = await page.$("label");

      await label!.selectText();

      expect(await page.evaluate(() => {
        const element = document.querySelector("input") as HTMLInputElement;
        return {
          selectionStart: element.selectionStart,
          selectionEnd: element.selectionEnd,
          active: document.activeElement === element,
          hasFocus: document.hasFocus()
        };
      })).toEqual({
        selectionStart: 0,
        selectionEnd: 10,
        active: true,
        hasFocus: false
      });
    });
  });
});
