import fs from "fs";
import path from "path";
import iconv from "iconv-lite"; // iconv-lite をインポート

export function ServerComponent() {
  const boxStyle = {
    width: "400px",
    height: "300px",
    backgroundColor: "#006400",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
  };

  const textStyle = { color: "white", footSize: "larger", fontWeight: "bold" };

  return (
    <div style={boxStyle}>
      <p style={textStyle}>Server Component</p>
    </div>
  );
}

// サーバーサイドでファイルを読み込むコンポーネント
export function getHoliday() {
  const filePath = path.join(process.cwd(), "src/libs", "syukujitsu.csv");
  const fileBuffer = fs.readFileSync(filePath);

  // TODO: 配列の整形はクライアントサイドでやってもいいかも
  const [_, ...holidayList] = iconv
    .decode(fileBuffer, "Shift_JIS")
    .trim()
    .split("\n")
    .map((line) => line.split(",")[0])
    .map((date) => date.replace(/\//g, "-")); // / を - に置き換える処理を追加

  return holidayList;
}
