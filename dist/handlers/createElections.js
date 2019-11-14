'use strict';

function _toConsumableArray(arr) { if (Array.isArray(arr)) { for (var i = 0, arr2 = Array(arr.length); i < arr.length; i++) { arr2[i] = arr[i]; } return arr2; } else { return Array.from(arr); } }

var fs = require('fs');
var partyArr = ['A', 'AA', 'AAC', 'AAP', 'ABP', 'ACD', 'ACPN', 'AD', 'ADC', 'ADP', 'AGA', 'AGAP', 'ANDP', 'ANN', 'ANP', 'ANRP', 'APA', 'APC', 'APDA', 'APGA', 'APM', 'APN', 'APP', 'ASD', 'AUN', 'BNPP', 'C4C', 'CAP', 'CNP', 'COP', 'DA', 'DPC', 'DPP', 'FJP', 'FRESH', 'GDPN', 'GPN', 'HDP', 'ID', 'JMPP', 'KP', 'LM', 'LP', 'LPN', 'MAJA', 'MDP', 'MMN', 'MPN', 'MRDD', 'NAC', 'NCMP', 'NCP', 'NDCP', 'NDLP', 'NEPP', 'NFD', 'NGP', 'NIP', 'NNPP', 'NPC', 'NPM', 'NRM', 'NUP', 'PCP', 'PDC', 'PDM', 'PDP', 'PPA', 'PPC', 'PPN', 'PPP', 'PRP', 'PT', 'RAP', 'RBNP', 'RP', 'SDP', 'SNC', 'SNP', 'SPN', 'UDP', 'UP', 'UPC', 'UPN', 'UPP', 'WTPN', 'YDP', 'YES', 'YP', 'YPP', 'ZLP'];

var senatorialArr = ["SD/001/AB", "SD/002/AB", "SD/003/AB", "SD/004/AD", "SD/005/AD", "SD/006/AD", "SD/007/AK", "SD/008/AK", "SD/009/AK", "SD/010/AN", "SD/011/AN", "SD/012/AN", "SD/013/BA", "SD/014/BA", "SD/015/BA", "SD/016/BY", "SD/017/BY", "SD/018/BY", "SD/019/BN", "SD/020/BN", "SD/021/BN", "SD/022/BO", "SD/023/BO", "SD/024/BO", "SD/025/CR", "SD/026/CR", "SD/027/CR", "SD/028/DT", "SD/029/DT", "SD/030/DT", "SD/031/EB", "SD/032/EB", "SD/033/EB", "SD/034/ED", "SD/035/ED", "SD/036/ED", "SD/037/EK", "SD/038/EK", "SD/039/EK", "SD/040/EN", "SD/041/EN", "SD/042/EN", "SD/043/GM", "SD/044/GM", "SD/045/GM", "SD/046/IM", "SD/047/IM", "SD/048/IM", "SD/049/JG", "SD/050/JG", "SD/051/JG", "SD/052/KD", "SD/053/KD", "SD/054/KD", "SD/055/KN", "SD/056/KN", "SD/057/KN", "SD/058/KT", "SD/059/KT", "SD/060/KT", "SD/061/KB", "SD/062/KB", "SD/063/KB", "SD/064/KG", "SD/065/KG", "SD/066/KG", "SD/067/KW", "SD/068/KW", "SD/069/KW", "SD/070/LA", "SD/071/LA", "SD/072/LA", "SD/073/NW", "SD/074/NW", "SD/075/NW", "SD/076/NG", "SD/077/NG", "SD/078/NG", "SD/079/OG", "SD/080/OG", "SD/081/OG", "SD/082/OD", "SD/083/OD", "SD/084/OD", "SD/085/OS", "SD/086/OS", "SD/087/OS", "SD/088/OY", "SD/089/OY", "SD/090/OY", "SD/091/PL", "SD/092/PL", "SD/093/PL", "SD/094/RV", "SD/095/RV", "SD/096/RV", "SD/097/SO", "SD/098/SO", "SD/099/SO", "SD/100/TR", "SD/101/TR", "SD/102/TR", "SD/103/YB", "SD/104/YB", "SD/105/YB", "SD/106/ZF", "SD/107/ZF", "SD/108/ZF", "SD/109/FCT"];

var electionObj = {};
var electionArr = [];

var hrepArr = ["FC/001/AB", "FC/002/AB", "FC/003/AB", "FC/004/AB", "FC/005/AB", "FC/006/AB", "FC/007/AB", "FC/008/AB", "FC/009/AD", "FC/010/AD", "FC/011/AD", "FC/012/AD", "FC/013/AD", "FC/014/AD", "FC/015/AD", "FC/016/AD", "FC/017/AK", "FC/018/AK", "FC/019/AK", "FC/020/AK", "FC/021/AK", "FC/022/AK", "FC/023/AK", "FC/024/AK", "FC/025/AK", "FC/026/AK", "FC/027/AN", "FC/028/AN", "FC/029/AN", "FC/030/AN", "FC/031/AN", "FC/032/AN", "FC/033/AN", "FC/034/AN", "FC/035/AN", "FC/036/AN", "FC/037/AN", "FC/038/BA", "FC/039/BA", "FC/040/BA", "FC/041/BA", "FC/042/BA", "FC/043/BA", "FC/044/BA", "FC/045/BA", "FC/046/BA", "FC/047/BA", "FC/048/BA", "FC/049/BA", "FC/050/BY", "FC/051/BY", "FC/052/BY", "FC/053/BY", "FC/054/BY", "FC/055/BN", "FC/056/BN", "FC/057/BN", "FC/058/BN", "FC/059/BN", "FC/060/BN", "FC/061/BN", "FC/062/BN", "FC/063/BN", "FC/064/BN", "FC/065/BN", "FC/066/BO", "FC/067/BO", "FC/068/BO", "FC/069/BO", "FC/070/BO", "FC/071/BO", "FC/072/BO", "FC/073/BO", "FC/074/BO", "FC/075/BO", "FC/076/CR", "FC/077/CR", "FC/078/CR", "FC/079/CR", "FC/080/CR", "FC/081/CR", "FC/082/CR", "FC/083/CR", "FC/084/DT", "FC/085/DT", "FC/086/DT", "FC/087/DT", "FC/088/DT", "FC/089/DT", "FC/090/DT", "FC/091/DT", "FC/092/DT", "FC/093/DT", "FC/094/EB", "FC/095/EB", "FC/096/EB", "FC/097/EB", "FC/098/EB", "FC/099/EB", "FC/100/ED", "FC/101/ED", "FC/102/ED", "FC/103/ED", "FC/104/ED", "FC/105/ED", "FC/106/ED", "FC/107/ED", "FC/108/ED", "FC/109/EK", "FC/110/EK", "FC/111/EK", "FC/112/EK", "FC/113/EK", "FC/114/EK", "FC/115/EN", "FC/116/EN", "FC/117/EN", "FC/118/EN", "FC/119/EN", "FC/120/EN", "FC/121/EN", "FC/122/EN", "FC/123/GM", "FC/124/GM", "FC/125/GM", "FC/126/GM", "FC/127/GM", "FC/128/GM", "FC/129/IM", "FC/130/IM", "FC/131/IM", "FC/132/IM", "FC/133/IM", "FC/134/IM", "FC/135/IM", "FC/136/IM", "FC/137/IM", "FC/138/IM", "FC/139/JG", "FC/140/JG", "FC/141/JG", "FC/142/JG", "FC/143/JG", "FC/144/JG", "FC/145/JG", "FC/146/JG", "FC/147/JG", "FC/148/JG", "FC/149/JG", "FC/150/KD", "FC/151/KD", "FC/152/KD", "FC/153/KD", "FC/154/KD", "FC/155/KD", "FC/156/KD", "FC/157/KD", "FC/158/KD", "FC/159/KD", "FC/160/KD", "FC/161/KD", "FC/162/KD", "FC/163/KD", "FC/164/KD", "FC/165/KD", "FC/166/KN", "FC/167/KN", "FC/168/KN", "FC/169/KN", "FC/170/KN", "FC/171/KN", "FC/172/KN", "FC/173/KN", "FC/174/KN", "FC/175/KN", "FC/176/KN", "FC/177/KN", "FC/178/KN", "FC/179/KN", "FC/180/KN", "FC/181/KN", "FC/182/KN", "FC/183/KN", "FC/184/KN", "FC/185/KN", "FC/186/KN", "FC/187/KN", "FC/188/KN", "FC/189/KN", "FC/190/KT", "FC/191/KT", "FC/192/KT", "FC/193/KT", "FC/194/KT", "FC/195/KT", "FC/196/KT", "FC/197/KT", "FC/198/KT", "FC/199/KT", "FC/200/KT", "FC/201/KT", "FC/202/KT", "FC/203/KT", "FC/204/KT", "FC/205/KB", "FC/206/KB", "FC/207/KB", "FC/208/KB", "FC/209/KB", "FC/210/KB", "FC/211/KB", "FC/212/KB", "FC/213/KG", "FC/214/KG", "FC/215/KG", "FC/216/KG", "FC/217/KG", "FC/218/KG", "FC/219/KG", "FC/220/KG", "FC/221/KG", "FC/222/KW", "FC/223/KW", "FC/224/KW", "FC/225/KW", "FC/226/KW", "FC/227/KW", "FC/228/LA", "FC/229/LA", "FC/230/LA", "FC/231/LA", "FC/232/LA", "FC/233/LA", "FC/234/LA", "FC/235/LA", "FC/236/LA", "FC/237/LA", "FC/238/LA", "FC/239/LA", "FC/240/LA", "FC/241/LA", "FC/242/LA", "FC/243/LA", "FC/244/LA", "FC/245/LA", "FC/246/LA", "FC/247/LA", "FC/248/LA", "FC/249/LA", "FC/250/LA", "FC/251/LA", "FC/252/NW", "FC/253/NW", "FC/254/NW", "FC/255/NW", "FC/256/NW", "FC/257/NG", "FC/258/NG", "FC/259/NG", "FC/260/NG", "FC/261/NG", "FC/262/NG", "FC/263/NG", "FC/264/NG", "FC/265/NG", "FC/266/NG", "FC/267/OG", "FC/268/OG", "FC/269/OG", "FC/270/OG", "FC/271/OG", "FC/272/OG", "FC/273/OG", "FC/274/OG", "FC/275/OG", "FC/276/OD", "FC/277/OD", "FC/278/OD", "FC/279/OD", "FC/280/OD", "FC/281/OD", "FC/282/OD", "FC/283/OD", "FC/284/OD", "FC/285/OS", "FC/286/OS", "FC/287/OS", "FC/288/OS", "FC/289/OS", "FC/290/OS", "FC/291/OS", "FC/292/OS", "FC/293/OS", "FC/294/OY", "FC/295/OY", "FC/296/OY", "FC/297/OY", "FC/298/OY", "FC/299/OY", "FC/300/OY", "FC/301/OY", "FC/302/OY", "FC/303/OY", "FC/304/OY", "FC/305/OY", "FC/306/OY", "FC/307/OY", "FC/308/PL", "FC/309/PL", "FC/310/PL", "FC/311/PL", "FC/312/PL", "FC/313/PL", "FC/314/PL", "FC/315/PL", "FC/316/RV", "FC/317/RV", "FC/318/RV", "FC/319/RV", "FC/320/RV", "FC/321/RV", "FC/322/RV", "FC/323/RV", "FC/324/RV", "FC/325/RV", "FC/326/RV", "FC/327/RV", "FC/328/RV", "FC/329/SO", "FC/330/SO", "FC/331/SO", "FC/332/SO", "FC/333/SO", "FC/334/SO", "FC/335/SO", "FC/336/SO", "FC/337/SO", "FC/338/SO", "FC/339/SO", "FC/340/TR", "FC/341/TR", "FC/342/TR", "FC/343/TR", "FC/344/TR", "FC/345/TR", "FC/346/YB", "FC/347/YB", "FC/348/YB", "FC/349/YB", "FC/350/YB", "FC/351/YB", "FC/352/ZF", "FC/353/ZF", "FC/354/ZF", "FC/355/ZF", "FC/356/ZF", "FC/357/ZF", "FC/358/ZF", "FC/359/FCT", "FC/360/FCT"];

var randomArr = function randomArr(len, max) {
  return [].concat(_toConsumableArray(new Array(len))).map(function () {
    return Math.round(Math.random() * max);
  }).filter(function (it, i, ar) {
    return ar.indexOf(it) === i;
  });
};

var createElection = function createElection(electionName, electionCode) {
  var partyTemp = [];
  randomArr(14, 90).forEach(function (el) {
    partyTemp.push({ "name": partyArr[el] });
  });
  return {
    "electionCode": electionCode,
    "electionParties": partyTemp,
    "electionName": electionName,
    "electionDate": "2020-08-07T23:00:00.000+0000"
  };
};

electionArr.push(createElection('Presidential', 'PD/111/NIG'));

senatorialArr.forEach(function (el) {
  electionArr.push(createElection('Senatorial', el));
});

hrepArr.forEach(function (el) {
  electionArr.push(createElection('House of Rep', el));
});

electionObj['election'] = electionArr;
var electionJson = JSON.stringify(electionObj);
fs.writeFile('elections.json', electionJson, function () {
  console.log('Done writing');
});
//# sourceMappingURL=createElections.js.map