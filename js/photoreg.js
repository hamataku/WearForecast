let count = 0;
let hash = "";
(() => {
  $('#upbutton').hide();
  count = localStorage.getItem("キー");
  if (count == null) {
    count = "0";
    localStorage.setItem("キー", "0");
  }
  // ユーザープールの設定
  const poolData = {
    UserPoolId: "ap-northeast-1_bX1jgrpZQ",
    ClientId: "63ubgk2st9c0r6m7h49hb77q2c"
  };
  const userPool = new AmazonCognitoIdentity.CognitoUserPool(poolData);
  const cognitoUser = userPool.getCurrentUser(); // 現在のユーザー

  const currentUserData = {}; // ユーザーの属性情報

  // Amazon Cognito 認証情報プロバイダーを初期化します
  AWS.config.region = "ap-northeast-1"; // リージョン
  AWS.config.credentials = new AWS.CognitoIdentityCredentials({
    IdentityPoolId: "ap-northeast-1:1d64aa86-ba4d-4ce0-9b8d-a8977e8bc43e"
  });



  // 現在のユーザーの属性情報を取得・表示する
  // 現在のユーザー情報が取得できているか？
  if (cognitoUser != null) {
    cognitoUser.getSession((err, session) => {
      if (err) {
        console.log(err);
        location.href = "signin.html";
      } else {
        // ユーザの属性を取得
        cognitoUser.getUserAttributes((err, result) => {
          if (err) {
            location.href = "signin.html";
          }

          // 取得した属性情報を連想配列に格納
          for (i = 0; i < result.length; i++) {
            currentUserData[result[i].getName()] = result[i].getValue();
          }
          document.getElementById("name").innerHTML =
              "ようこそ！" + currentUserData["name"] + "さん";
          document.getElementById("role").innerHTML =
              "Your Role is " + currentUserData["custom:custom:role"];
          document.getElementById("email").innerHTML =
              "Your E-Mail is " + currentUserData["email"];

          hash = CybozuLabs.MD5.calc(currentUserData["email"]);

          // サインアウト処理
          const signoutButton = document.getElementById("signout");
          signoutButton.addEventListener("click", event => {
            cognitoUser.signOut();
            location.reload();
          });
          signoutButton.hidden = false;
          console.log(currentUserData);
        });
      }
    });
  } else {
    location.href = "signin.html";
  }

})();

$('#upfile').change(function() {

  if (this.files.length > 0) {
    // 選択されたファイル情報を取得
    var file = this.files[0];
    // readerのresultプロパティに、データURLとしてエンコードされたファイルデータを格納
    var reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = function() {
      $('#thumbnail').attr('src', reader.result);
    }
    $('#upbutton').show();
  }
});

// 画像をアップロード
$('#imgForm').on('submit', function(e) {
  $('#upbutton').hide();
  // 要素を取得
  var elements = document.getElementsByName( "example" ) ;

// 選択状態の値を取得
  for ( var a="", i=elements.length; i--; ) {
    if ( elements[i].checked ) {
      var a = elements[i].value ;
      break ;
    }
  }

  $('#upfile').attr({
    'name': hash+"/"+count+"-"+a
  });
  count++;
  e.preventDefault();
  var formData = new FormData($('#imgForm').get(0));
  console.log($('#imgForm').get(0));
  
  $.ajax($(this).attr('action'), {
    type: 'post',
    processData: false,
    contentType: false,
    data: formData,
    success: document.getElementById('compUpload').innerHTML = 'アップロード中' // 送信に成功したとき

  }).done(function(response) {
    let jsonbody = JSON.parse(response.body);
    console.log('succes!'); // レスポンスがあったとき
    //ローカルストレージにレスポンスのファイル名を格納
    var array = [];
    var obj = {
      'キー1': '値1',
      'キー2': '値2'
    };
    array.push(obj);
    var setjson = JSON.stringify(obj);
    localStorage.setItem('キー', count);
    document.getElementById('compUpload').innerHTML = 'アップロード完了しました。写真に写っているのは'+jsonbody.message+'です。'

  }).fail(function() {
    console.log('error!'); // エラーが発生したとき
  });
  return false;
});

