import { UITranslations, StageTranslations } from "./types";

export const ui: UITranslations = {
  title: "SHELL FORTRESS",
  subtitle: "故障した宇宙要塞を探検しながらLinuxコマンドを学ぼう。",
  bootMessage: "システム起動シーケンス開始",
  startMission: "> ミッション開始",
  browserGame: "ブラウザで遊べる学習ゲーム",
  stageSelect: "ステージ選択",
  back: "← 戻る",
  cleared: "クリア済",
  commandsLearned: "習得コマンド数",
  totalCommandsUsed: "総コマンド使用回数",
  stage: "ステージ",
  locked: "未開放",

  location: "現在地",
  sectorMap: "セクターマップ",
  activeProcesses: "稼働中プロセス",
  emptyRoom: "空の部屋",
  parent: "親ディレクトリ",
  directory: "ディレクトリ",
  file: "ファイル",
  objectives: "目標",
  commandsUsed: "使用コマンド",
  noCommandsYet: "まだコマンドを使っていません",
  hint: "ヒント",
  reset: "リセット",

  terminalPath: "要塞ターミナル",
  typeCommand: "コマンドを入力...",
  stageCompleteInput: "ステージクリア！",

  stageClear: "ステージクリア",
  missionAccomplished: "ミッション完了、オペレーター。",
  time: "クリア時間",
  cmdsUsed: "使用コマンド数",
  hintsUsed: "ヒント使用回数",
  newCommandsLearned: "新しく習得したコマンド",
  stageSelectButton: "ステージ選択",
  nextStage: "次のステージ →",
  backToMenu: "メニューに戻る",

  exit: "← 退出",
  cmds: "コマンド",
  loading: "要塞システムを読み込み中...",

  helpHeader: "Shell Fortress ターミナル v1.0",
  availableCommands: "このステージで使えるコマンド",
  typeHelp: '"help" と入力するとヘルプを表示します。',
  stageComplete: "ステージクリア！ 全目標を達成しました。",

  terminatingHostile: "敵対プロセスを終了中",
  processTerminated: "を終了しました",
  wrongTarget: "対象が違います！ は味方プロセスでした。",

  sudoAlreadyElevated: "sudo: 既に権限昇格済みです。",
  sudoGranted: "[SUDO] このセッションで管理者権限が付与されました。",
};

export const stages: Record<string, StageTranslations> = {
  "stage-1": {
    name: "ナビゲーション・セクター",
    subtitle: "要塞内を移動する方法を学ぶ",
    description:
      "要塞の入口。各部屋はディレクトリに対応しています。ターミナルコマンドで出口を見つけましょう。",
    missionBriefing:
      "要塞の外壁を突破しました。ディレクトリ構造を移動して出口を目指してください。pwd、ls、cd を使って探索しましょう。",
    objectives: [
      { id: "find-map", description: "'ls' で要塞内の部屋を確認する" },
      { id: "navigate-corridor", description: "'cd' で east-corridor に移動する" },
      { id: "reach-exit", description: "出口の部屋を見つけて到達する" },
    ],
    hints: [
      "'ls' と入力して、現在のディレクトリの中身を見てみましょう。",
      "'cd <ディレクトリ名>' で部屋に入れます。'cd east-corridor' を試してみましょう。",
      "出口は east-corridor の中にあります。そこで 'ls' を使い、'cd' で移動しましょう。",
      "正解ルート: cd east-corridor → cd control-room → cd exit",
    ],
    fileContents: {
      "readme.txt":
        "要塞ナビゲーションシステム v2.1\n'ls' で部屋一覧を表示。\n'cd <部屋名>' で部屋に入る。\n'pwd' で現在地を確認。\n出口を見つけて先に進め。",
      "supplies.txt": "非常食: 12\n酸素タンク: 4\n修理キット: 2",
      "warning.txt": "⚠ この通路は封鎖されています。引き返してください。",
      "view.txt":
        "窓の外に広大な宇宙が広がっている。要塞は消えゆく恒星の軌道を周回している。",
      "terminal-log.txt": "最終アクセス: 2187-03-14\nステータス: EXIT への扉はこの部屋を通って行けます。",
      "access-granted.txt": "出口が開きました。セクターの移動に成功しました。",
    },
  },
  "stage-2": {
    name: "修理ベイ",
    subtitle: "ログを調査してシステムを修復する",
    description:
      "生命維持装置が故障しています。ログファイルを調べてエラーコードを見つけ、システムを修復しましょう。",
    missionBriefing:
      "生命維持装置が危機的状況です！ 修理ベイのログファイルを調べてエラーの原因を特定し、修理コードを取得してください。cat、grep、tail を使ってデータを分析しましょう。",
    objectives: [
      { id: "read-logs", description: "'cat' でシステムステータスファイルを読む" },
      { id: "find-error", description: "'grep' でログ内の ERROR エントリを見つける" },
      { id: "find-repair-code", description: "'tail' で最新の修理コードを確認する" },
    ],
    hints: [
      "まず 'ls' と入力して利用可能なファイルを確認しましょう。",
      "'cat status.txt' でシステム状態を確認しましょう。",
      "'grep ERROR system-log.txt' でエラーエントリを検索しましょう。",
      "'tail -n 3 repair-codes.txt' で最新の修理コードを確認。最後のコードが答えです。",
    ],
    fileContents: {
      "status.txt":
        "=== 要塞修理ベイ ===\n生命維持: 危機的\nエンジン: 稼働中\nシールド: 稼働中\n通信: オフライン\n\n警告: 生命維持装置の障害を検出。\n詳細は system-log.txt を確認してください。\nrepair-codes.txt から修理コードが必要です。",
      "module-report.txt":
        "モジュール LS-07 レポート:\nタイプ: 酸素リサイクラー\n場所: セクター7、ベイ3\nステータス: 故障\n最終メンテナンス: 2187-02-28\n修理難易度: 中程度",
    },
  },
  "stage-3": {
    name: "データ・コンベア",
    subtitle: "パイプラインとテキスト処理をマスターする",
    description:
      "破損したコンベアにデータパケットが流れています。パイプラインを構築してデータをフィルタ・ソートし、ターゲット出力と一致させましょう。",
    missionBriefing:
      "データコンベアが破損した貨物マニフェストで詰まっています。パイプラインを構築してデータをフィルタ、ソート、重複排除してください。出力がターゲットマニフェストと完全に一致する必要があります。",
    objectives: [
      { id: "filter-data", description: "grep を使ったパイプラインで貨物データをフィルタする" },
      { id: "sort-unique", description: "sort と uniq を使ったパイプラインで重複を排除する" },
      { id: "match-target", description: "ターゲットマニフェストと完全に一致する出力を生成する" },
    ],
    hints: [
      "まず 'cat cargo-data.txt' で生データを確認しましょう。",
      "'cat target-manifest.txt' で目標の出力を確認しましょう。",
      "'cat cargo-data.txt | grep PRIORITY' で優先アイテムをフィルタしましょう。",
      "正解: cat cargo-data.txt | grep PRIORITY | sort | uniq",
    ],
    fileContents: {
      "instructions.txt":
        "コンベアシステム・マニュアル\n\nコンベアを修復するには、クリーンなマニフェストを作成してください。\n1. 貨物データを読む (cat)\n2. PRIORITY アイテムだけをフィルタ (grep)\n3. 結果をソート (sort)\n4. 重複を排除 (uniq)\n5. target-manifest.txt と比較\n\nパイプラインは | 記号でコマンドを繋げます。\n例: cat file.txt | grep pattern | sort",
    },
  },
  "stage-4": {
    name: "暴走プロセス",
    subtitle: "ミニボス — 敵対プロセスを終了せよ",
    description:
      "暴走したAIプロセスが防衛ドローンを制御しています。正しいプロセスを見つけて終了させましょう。",
    missionBriefing:
      "警報: 防衛ドローンが暴走プロセスに乗っ取られました！ プロセステーブルを調査し、情報を集めて、正しいプロセスを終了させてください。間違ったプロセスを停止するとペナルティがあります！",
    objectives: [
      { id: "inspect-processes", description: "'ps' で稼働中のプロセスを確認する" },
      { id: "identify-threat", description: "情報ファイルを読んで敵対プロセスを特定する" },
      { id: "kill-boss", description: "'kill' で正しいPIDを指定して暴走プロセスを終了する" },
    ],
    hints: [
      "'ps' と入力して全プロセスとPIDを確認しましょう。",
      "'ls' と 'cat' で情報ファイルを読みましょう。",
      "'cat intel/threat-analysis.txt' でボスプロセスを特定しましょう。",
      "暴走プロセスは 'DRONE-MASTER' です。'ps' でPIDを確認し、'kill <PID>' で終了させましょう。",
    ],
    fileContents: {
      "process-manual.txt":
        "要塞プロセス管理マニュアル\n\nコマンド:\n  ps       - 稼働中の全プロセスを一覧表示\n  kill PID - PID番号を指定してプロセスを終了\n\nヒント:\n  - プロセスを終了する前に必ずPIDを確認\n  - システム重要プロセスは終了させないこと\n  - 行動前に情報レポートを確認",
      "threat-analysis.txt":
        "=== 脅威分析レポート ===\n\n0800時、防衛ドローンが異常行動を開始。\n原因: 不正プロセス 'DRONE-MASTER' (PID 256)\nこのプロセスがドローンリレーに指令を出している。\n\n推奨: DRONE-MASTER を終了して全ドローンを無効化せよ。\n警告: fortress-core や life-support を停止するな！\n\nマスタープロセスが終了すれば\nリレープロセスは自動的にシャットダウンする。",
      "drone-log.txt":
        "[08:00] ドローン巡回初期化\n[08:05] DRONE-MASTER による制御乗っ取りを検出\n[08:06] ドローンが敵対巡回パターンに変更\n[08:10] 警告: 全ドローンの武装が有効化\n[08:15] 手動オーバーライド試行 — 拒否\n[08:20] DRONE-MASTER が標準キル信号を拒否",
    },
  },
};
