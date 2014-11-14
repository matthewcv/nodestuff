/**
 * Created by matthew on 11/13/2014.
 */

var fs = require('fs')
    , util = require('util')
    , stream = require('stream')
    , es = require("event-stream")
, mongo = require("mongodb");

var lineNr = 1;

var processor = new Processor();

s = fs.createReadStream('PEP_2013_PEPAGESEX_with_ann.csv')
    .pipe(es.split())
    .pipe(es.mapSync(function(line){

        // pause the readstream
        s.pause();


        (function(){
            if(lineNr == 1){
                processor.firstLine(line);
            }
            if(lineNr > 2){
                processor.dataLine(line);
            }

            lineNr += 1;

            // resume the readstream
            s.resume();

        })();
    })
        .on('error', function(){
            console.log('Error while reading file.');
        })
        .on('end', function(){

            mongo.MongoClient.connect("mongodb://localhost:27017/census", function(er,db){
                db.collection("countyPopulation").insert(processor.data, function(er1, data){

                    console.log('docs insertted');
                    db.close();
                })
            })


            console.log('Read entire file.')
        })
);






function Processor(){
    this.dataLabels = null;
    this.data = [];

}

Processor.prototype.firstLine = function(line){
    var bits = line.split(',');
    bits.splice(0,3);
    this.dataLabels = bits;

}

Processor.prototype.dataLine= function(line){
    var data = line.split(',');
    if(data.length > 1) {
        var meta = data.splice(0, 4);
        var obj = {
            stateId : parseInt(meta[1].substr(0,2)),
            state: meta[3].trim().replace("\"",""),
            countyId: parseInt(meta[1].substr(2,3)),
            county: meta[2].replace("\"","")
        };

        this.dataLabels.forEach(function(l,i){
            obj[l] = parseInt(data[i]);
        })

        this.data.push(obj);

    }
}


/*
 GEO.id,GEO.id2,GEO.display-label,cen42010sex0_age999,cen42010sex1_age999,cen42010sex2_age999,est42010sex0_age999,est42010sex1_age999,est42010sex2_age999,est72010sex0_age999,est72010sex1_age999,est72010sex2_age999,est72011sex0_age999,est72011sex1_age999,est72011sex2_age999,est72012sex0_age999,est72012sex1_age999,est72012sex2_age999,est72013sex0_age999,est72013sex1_age999,est72013sex2_age999,cen42010sex0_age0to4,cen42010sex1_age0to4,cen42010sex2_age0to4,est42010sex0_age0to4,est42010sex1_age0to4,est42010sex2_age0to4,est72010sex0_age0to4,est72010sex1_age0to4,est72010sex2_age0to4,est72011sex0_age0to4,est72011sex1_age0to4,est72011sex2_age0to4,est72012sex0_age0to4,est72012sex1_age0to4,est72012sex2_age0to4,est72013sex0_age0to4,est72013sex1_age0to4,est72013sex2_age0to4,cen42010sex0_age5to9,cen42010sex1_age5to9,cen42010sex2_age5to9,est42010sex0_age5to9,est42010sex1_age5to9,est42010sex2_age5to9,est72010sex0_age5to9,est72010sex1_age5to9,est72010sex2_age5to9,est72011sex0_age5to9,est72011sex1_age5to9,est72011sex2_age5to9,est72012sex0_age5to9,est72012sex1_age5to9,est72012sex2_age5to9,est72013sex0_age5to9,est72013sex1_age5to9,est72013sex2_age5to9,cen42010sex0_age10to14,cen42010sex1_age10to14,cen42010sex2_age10to14,est42010sex0_age10to14,est42010sex1_age10to14,est42010sex2_age10to14,est72010sex0_age10to14,est72010sex1_age10to14,est72010sex2_age10to14,est72011sex0_age10to14,est72011sex1_age10to14,est72011sex2_age10to14,est72012sex0_age10to14,est72012sex1_age10to14,est72012sex2_age10to14,est72013sex0_age10to14,est72013sex1_age10to14,est72013sex2_age10to14,cen42010sex0_age15to19,cen42010sex1_age15to19,cen42010sex2_age15to19,est42010sex0_age15to19,est42010sex1_age15to19,est42010sex2_age15to19,est72010sex0_age15to19,est72010sex1_age15to19,est72010sex2_age15to19,est72011sex0_age15to19,est72011sex1_age15to19,est72011sex2_age15to19,est72012sex0_age15to19,est72012sex1_age15to19,est72012sex2_age15to19,est72013sex0_age15to19,est72013sex1_age15to19,est72013sex2_age15to19,cen42010sex0_age20to24,cen42010sex1_age20to24,cen42010sex2_age20to24,est42010sex0_age20to24,est42010sex1_age20to24,est42010sex2_age20to24,est72010sex0_age20to24,est72010sex1_age20to24,est72010sex2_age20to24,est72011sex0_age20to24,est72011sex1_age20to24,est72011sex2_age20to24,est72012sex0_age20to24,est72012sex1_age20to24,est72012sex2_age20to24,est72013sex0_age20to24,est72013sex1_age20to24,est72013sex2_age20to24,cen42010sex0_age25to29,cen42010sex1_age25to29,cen42010sex2_age25to29,est42010sex0_age25to29,est42010sex1_age25to29,est42010sex2_age25to29,est72010sex0_age25to29,est72010sex1_age25to29,est72010sex2_age25to29,est72011sex0_age25to29,est72011sex1_age25to29,est72011sex2_age25to29,est72012sex0_age25to29,est72012sex1_age25to29,est72012sex2_age25to29,est72013sex0_age25to29,est72013sex1_age25to29,est72013sex2_age25to29,cen42010sex0_age30to34,cen42010sex1_age30to34,cen42010sex2_age30to34,est42010sex0_age30to34,est42010sex1_age30to34,est42010sex2_age30to34,est72010sex0_age30to34,est72010sex1_age30to34,est72010sex2_age30to34,est72011sex0_age30to34,est72011sex1_age30to34,est72011sex2_age30to34,est72012sex0_age30to34,est72012sex1_age30to34,est72012sex2_age30to34,est72013sex0_age30to34,est72013sex1_age30to34,est72013sex2_age30to34,cen42010sex0_age35to39,cen42010sex1_age35to39,cen42010sex2_age35to39,est42010sex0_age35to39,est42010sex1_age35to39,est42010sex2_age35to39,est72010sex0_age35to39,est72010sex1_age35to39,est72010sex2_age35to39,est72011sex0_age35to39,est72011sex1_age35to39,est72011sex2_age35to39,est72012sex0_age35to39,est72012sex1_age35to39,est72012sex2_age35to39,est72013sex0_age35to39,est72013sex1_age35to39,est72013sex2_age35to39,cen42010sex0_age40to44,cen42010sex1_age40to44,cen42010sex2_age40to44,est42010sex0_age40to44,est42010sex1_age40to44,est42010sex2_age40to44,est72010sex0_age40to44,est72010sex1_age40to44,est72010sex2_age40to44,est72011sex0_age40to44,est72011sex1_age40to44,est72011sex2_age40to44,est72012sex0_age40to44,est72012sex1_age40to44,est72012sex2_age40to44,est72013sex0_age40to44,est72013sex1_age40to44,est72013sex2_age40to44,cen42010sex0_age45to49,cen42010sex1_age45to49,cen42010sex2_age45to49,est42010sex0_age45to49,est42010sex1_age45to49,est42010sex2_age45to49,est72010sex0_age45to49,est72010sex1_age45to49,est72010sex2_age45to49,est72011sex0_age45to49,est72011sex1_age45to49,est72011sex2_age45to49,est72012sex0_age45to49,est72012sex1_age45to49,est72012sex2_age45to49,est72013sex0_age45to49,est72013sex1_age45to49,est72013sex2_age45to49,cen42010sex0_age50to54,cen42010sex1_age50to54,cen42010sex2_age50to54,est42010sex0_age50to54,est42010sex1_age50to54,est42010sex2_age50to54,est72010sex0_age50to54,est72010sex1_age50to54,est72010sex2_age50to54,est72011sex0_age50to54,est72011sex1_age50to54,est72011sex2_age50to54,est72012sex0_age50to54,est72012sex1_age50to54,est72012sex2_age50to54,est72013sex0_age50to54,est72013sex1_age50to54,est72013sex2_age50to54,cen42010sex0_age55to59,cen42010sex1_age55to59,cen42010sex2_age55to59,est42010sex0_age55to59,est42010sex1_age55to59,est42010sex2_age55to59,est72010sex0_age55to59,est72010sex1_age55to59,est72010sex2_age55to59,est72011sex0_age55to59,est72011sex1_age55to59,est72011sex2_age55to59,est72012sex0_age55to59,est72012sex1_age55to59,est72012sex2_age55to59,est72013sex0_age55to59,est72013sex1_age55to59,est72013sex2_age55to59,cen42010sex0_age60to64,cen42010sex1_age60to64,cen42010sex2_age60to64,est42010sex0_age60to64,est42010sex1_age60to64,est42010sex2_age60to64,est72010sex0_age60to64,est72010sex1_age60to64,est72010sex2_age60to64,est72011sex0_age60to64,est72011sex1_age60to64,est72011sex2_age60to64,est72012sex0_age60to64,est72012sex1_age60to64,est72012sex2_age60to64,est72013sex0_age60to64,est72013sex1_age60to64,est72013sex2_age60to64,cen42010sex0_age65to69,cen42010sex1_age65to69,cen42010sex2_age65to69,est42010sex0_age65to69,est42010sex1_age65to69,est42010sex2_age65to69,est72010sex0_age65to69,est72010sex1_age65to69,est72010sex2_age65to69,est72011sex0_age65to69,est72011sex1_age65to69,est72011sex2_age65to69,est72012sex0_age65to69,est72012sex1_age65to69,est72012sex2_age65to69,est72013sex0_age65to69,est72013sex1_age65to69,est72013sex2_age65to69,cen42010sex0_age70to74,cen42010sex1_age70to74,cen42010sex2_age70to74,est42010sex0_age70to74,est42010sex1_age70to74,est42010sex2_age70to74,est72010sex0_age70to74,est72010sex1_age70to74,est72010sex2_age70to74,est72011sex0_age70to74,est72011sex1_age70to74,est72011sex2_age70to74,est72012sex0_age70to74,est72012sex1_age70to74,est72012sex2_age70to74,est72013sex0_age70to74,est72013sex1_age70to74,est72013sex2_age70to74,cen42010sex0_age75to79,cen42010sex1_age75to79,cen42010sex2_age75to79,est42010sex0_age75to79,est42010sex1_age75to79,est42010sex2_age75to79,est72010sex0_age75to79,est72010sex1_age75to79,est72010sex2_age75to79,est72011sex0_age75to79,est72011sex1_age75to79,est72011sex2_age75to79,est72012sex0_age75to79,est72012sex1_age75to79,est72012sex2_age75to79,est72013sex0_age75to79,est72013sex1_age75to79,est72013sex2_age75to79,cen42010sex0_age80to84,cen42010sex1_age80to84,cen42010sex2_age80to84,est42010sex0_age80to84,est42010sex1_age80to84,est42010sex2_age80to84,est72010sex0_age80to84,est72010sex1_age80to84,est72010sex2_age80to84,est72011sex0_age80to84,est72011sex1_age80to84,est72011sex2_age80to84,est72012sex0_age80to84,est72012sex1_age80to84,est72012sex2_age80to84,est72013sex0_age80to84,est72013sex1_age80to84,est72013sex2_age80to84,cen42010sex0_age85plus,cen42010sex1_age85plus,cen42010sex2_age85plus,est42010sex0_age85plus,est42010sex1_age85plus,est42010sex2_age85plus,est72010sex0_age85plus,est72010sex1_age85plus,est72010sex2_age85plus,est72011sex0_age85plus,est72011sex1_age85plus,est72011sex2_age85plus,est72012sex0_age85plus,est72012sex1_age85plus,est72012sex2_age85plus,est72013sex0_age85plus,est72013sex1_age85plus,est72013sex2_age85plus,cen42010sex0_age0to17,cen42010sex1_age0to17,cen42010sex2_age0to17,est42010sex0_age0to17,est42010sex1_age0to17,est42010sex2_age0to17,est72010sex0_age0to17,est72010sex1_age0to17,est72010sex2_age0to17,est72011sex0_age0to17,est72011sex1_age0to17,est72011sex2_age0to17,est72012sex0_age0to17,est72012sex1_age0to17,est72012sex2_age0to17,est72013sex0_age0to17,est72013sex1_age0to17,est72013sex2_age0to17,cen42010sex0_age0to4r,cen42010sex1_age0to4r,cen42010sex2_age0to4r,est42010sex0_age0to4r,est42010sex1_age0to4r,est42010sex2_age0to4r,est72010sex0_age0to4r,est72010sex1_age0to4r,est72010sex2_age0to4r,est72011sex0_age0to4r,est72011sex1_age0to4r,est72011sex2_age0to4r,est72012sex0_age0to4r,est72012sex1_age0to4r,est72012sex2_age0to4r,est72013sex0_age0to4r,est72013sex1_age0to4r,est72013sex2_age0to4r,cen42010sex0_age5to13,cen42010sex1_age5to13,cen42010sex2_age5to13,est42010sex0_age5to13,est42010sex1_age5to13,est42010sex2_age5to13,est72010sex0_age5to13,est72010sex1_age5to13,est72010sex2_age5to13,est72011sex0_age5to13,est72011sex1_age5to13,est72011sex2_age5to13,est72012sex0_age5to13,est72012sex1_age5to13,est72012sex2_age5to13,est72013sex0_age5to13,est72013sex1_age5to13,est72013sex2_age5to13,cen42010sex0_age14to17,cen42010sex1_age14to17,cen42010sex2_age14to17,est42010sex0_age14to17,est42010sex1_age14to17,est42010sex2_age14to17,est72010sex0_age14to17,est72010sex1_age14to17,est72010sex2_age14to17,est72011sex0_age14to17,est72011sex1_age14to17,est72011sex2_age14to17,est72012sex0_age14to17,est72012sex1_age14to17,est72012sex2_age14to17,est72013sex0_age14to17,est72013sex1_age14to17,est72013sex2_age14to17,cen42010sex0_age18to64,cen42010sex1_age18to64,cen42010sex2_age18to64,est42010sex0_age18to64,est42010sex1_age18to64,est42010sex2_age18to64,est72010sex0_age18to64,est72010sex1_age18to64,est72010sex2_age18to64,est72011sex0_age18to64,est72011sex1_age18to64,est72011sex2_age18to64,est72012sex0_age18to64,est72012sex1_age18to64,est72012sex2_age18to64,est72013sex0_age18to64,est72013sex1_age18to64,est72013sex2_age18to64,cen42010sex0_age18to24,cen42010sex1_age18to24,cen42010sex2_age18to24,est42010sex0_age18to24,est42010sex1_age18to24,est42010sex2_age18to24,est72010sex0_age18to24,est72010sex1_age18to24,est72010sex2_age18to24,est72011sex0_age18to24,est72011sex1_age18to24,est72011sex2_age18to24,est72012sex0_age18to24,est72012sex1_age18to24,est72012sex2_age18to24,est72013sex0_age18to24,est72013sex1_age18to24,est72013sex2_age18to24,cen42010sex0_age25to44,cen42010sex1_age25to44,cen42010sex2_age25to44,est42010sex0_age25to44,est42010sex1_age25to44,est42010sex2_age25to44,est72010sex0_age25to44,est72010sex1_age25to44,est72010sex2_age25to44,est72011sex0_age25to44,est72011sex1_age25to44,est72011sex2_age25to44,est72012sex0_age25to44,est72012sex1_age25to44,est72012sex2_age25to44,est72013sex0_age25to44,est72013sex1_age25to44,est72013sex2_age25to44,cen42010sex0_age45to64,cen42010sex1_age45to64,cen42010sex2_age45to64,est42010sex0_age45to64,est42010sex1_age45to64,est42010sex2_age45to64,est72010sex0_age45to64,est72010sex1_age45to64,est72010sex2_age45to64,est72011sex0_age45to64,est72011sex1_age45to64,est72011sex2_age45to64,est72012sex0_age45to64,est72012sex1_age45to64,est72012sex2_age45to64,est72013sex0_age45to64,est72013sex1_age45to64,est72013sex2_age45to64,cen42010sex0_age65plus,cen42010sex1_age65plus,cen42010sex2_age65plus,est42010sex0_age65plus,est42010sex1_age65plus,est42010sex2_age65plus,est72010sex0_age65plus,est72010sex1_age65plus,est72010sex2_age65plus,est72011sex0_age65plus,est72011sex1_age65plus,est72011sex2_age65plus,est72012sex0_age65plus,est72012sex1_age65plus,est72012sex2_age65plus,est72013sex0_age65plus,est72013sex1_age65plus,est72013sex2_age65plus,cen42010sex0_age85plusr,cen42010sex1_age85plusr,cen42010sex2_age85plusr,est42010sex0_age85plusr,est42010sex1_age85plusr,est42010sex2_age85plusr,est72010sex0_age85plusr,est72010sex1_age85plusr,est72010sex2_age85plusr,est72011sex0_age85plusr,est72011sex1_age85plusr,est72011sex2_age85plusr,est72012sex0_age85plusr,est72012sex1_age85plusr,est72012sex2_age85plusr,est72013sex0_age85plusr,est72013sex1_age85plusr,est72013sex2_age85plusr,cen42010sex0_age16plus,cen42010sex1_age16plus,cen42010sex2_age16plus,est42010sex0_age16plus,est42010sex1_age16plus,est42010sex2_age16plus,est72010sex0_age16plus,est72010sex1_age16plus,est72010sex2_age16plus,est72011sex0_age16plus,est72011sex1_age16plus,est72011sex2_age16plus,est72012sex0_age16plus,est72012sex1_age16plus,est72012sex2_age16plus,est72013sex0_age16plus,est72013sex1_age16plus,est72013sex2_age16plus,cen42010sex0_age18plus,cen42010sex1_age18plus,cen42010sex2_age18plus,est42010sex0_age18plus,est42010sex1_age18plus,est42010sex2_age18plus,est72010sex0_age18plus,est72010sex1_age18plus,est72010sex2_age18plus,est72011sex0_age18plus,est72011sex1_age18plus,est72011sex2_age18plus,est72012sex0_age18plus,est72012sex1_age18plus,est72012sex2_age18plus,est72013sex0_age18plus,est72013sex1_age18plus,est72013sex2_age18plus,cen42010sex0_age15to44,cen42010sex1_age15to44,cen42010sex2_age15to44,est42010sex0_age15to44,est42010sex1_age15to44,est42010sex2_age15to44,est72010sex0_age15to44,est72010sex1_age15to44,est72010sex2_age15to44,est72011sex0_age15to44,est72011sex1_age15to44,est72011sex2_age15to44,est72012sex0_age15to44,est72012sex1_age15to44,est72012sex2_age15to44,est72013sex0_age15to44,est72013sex1_age15to44,est72013sex2_age15to44,cen42010sex0_medage,cen42010sex1_medage,cen42010sex2_medage,est42010sex0_medage,est42010sex1_medage,est42010sex2_medage,est72010sex0_medage,est72010sex1_medage,est72010sex2_medage,est72011sex0_medage,est72011sex1_medage,est72011sex2_medage,est72012sex0_medage,est72012sex1_medage,est72012sex2_medage,est72013sex0_medage,est72013sex1_medage,est72013sex2_medage
 0500000US01001,01001,"Autauga County, Alabama",54571,26569,28002,54571,26569,28002,54613,26599,28014,55278,27046,28232,55265,26967,28298,55246,26796,28450,3579,1866,1713,3579,1866,1713,3586,1872,1714,3598,1888,1710,3527,1835,1692,3386,1735,1651,3991,2001,1990,3991,2001,1990,3952,1979,1973,3943,1956,1987,3837,1935,1902,3817,1928,1889,4290,2171,2119,4290,2171,2119,4282,2160,2122,4337,2213,2124,4394,2216,2178,4242,2114,2128,4290,2213,2077,4290,2213,2077,4136,2140,1996,3949,2039,1910,4051,2116,1935,4020,2069,1951,3080,1539,1541,3080,1539,1541,3154,1577,1577,3398,1744,1654,3402,1744,1658,3544,1830,1714,3157,1543,1614,3157,1543,1614,3181,1569,1612,3229,1620,1609,3209,1583,1626,3311,1582,1729,3330,1594,1736,3330,1594,1736,3367,1613,1754,3431,1659,1772,3327,1596,1731,3336,1617,1719,4157,2004,2153,4157,2004,2153,4127,1986,2141,3996,1930,2066,3820,1828,1992,3636,1730,1906,4086,1974,2112,4086,1974,2112,4103,1988,2115,4155,2019,2136,4187,2021,2166,4109,1972,2137,4332,2174,2158,4332,2174,2158,4316,2157,2159,4207,2086,2121,4107,2021,2086,4020,1955,2065,3873,1866,2007,3873,1866,2007,3910,1885,2025,4042,1977,2065,4121,2074,2047,4137,2075,2062,3083,1524,1559,3083,1524,1559,3124,1538,1586,3253,1586,1667,3268,1537,1731,3445,1601,1844,2777,1279,1498,2777,1279,1498,2787,1291,1496,2843,1334,1509,2770,1325,1445,2777,1337,1440,2277,1014,1263,2277,1014,1263,2285,1019,1266,2358,1044,1314,2483,1105,1378,2486,1126,1360,1736,807,929,1736,807,929,1749,812,937,1860,855,1005,1918,868,1050,2009,893,1116,1251,546,705,1251,546,705,1257,550,707,1306,583,723,1380,608,772,1433,628,805,731,295,436,731,295,436,744,301,443,788,325,463,842,343,499,905,384,521,551,159,392,551,159,392,553,162,391,585,188,397,622,212,410,633,220,413,14613,7455,7158,14613,7455,7158,14437,7360,7077,14304,7289,7015,14323,7308,7015,14029,7097,6932,3579,1866,1713,3579,1866,1713,3586,1872,1714,3598,1888,1710,3527,1835,1692,3386,1735,1651,7418,3747,3671,7418,3747,3671,7378,3711,3667,7413,3712,3701,7321,3693,3628,7200,3601,3599,3616,1842,1774,3616,1842,1774,3473,1777,1696,3293,1689,1604,3475,1780,1695,3443,1761,1682,33412,16293,17119,33412,16293,17119,33588,16395,17193,34077,16762,17315,33697,16523,17174,33751,16448,17303,4617,2335,2282,4617,2335,2282,4673,2368,2305,4921,2551,2370,4888,2538,2350,4980,2579,2401,14730,7115,7615,14730,7115,7615,14778,7156,7622,14811,7228,7583,14543,7028,7515,14392,6901,7491,14065,6843,7222,14065,6843,7222,14137,6871,7266,14345,6983,7362,14266,6957,7309,14379,6968,7411,6546,2821,3725,6546,2821,3725,6588,2844,3744,6897,2995,3902,7245,3136,4109,7466,3251,4215,551,159,392,551,159,392,553,162,391,585,188,397,622,212,410,633,220,413,41804,20046,21758,41804,20046,21758,41931,20133,21798,42556,20573,21983,42649,20528,22121,42907,20573,22334,39958,19114,20844,39958,19114,20844,40176,19239,20937,40974,19757,21217,40942,19659,21283,41217,19699,21518,22100,10867,11233,22100,10867,11233,22068,10873,11195,22158,11011,11147,21996,10888,11108,21956,10800,11156,37.0,35.9,37.9,37.0,35.9,37.9,37.1,36.1,38.0,37.3,36.2,38.4,37.6,36.3,38.7,37.8,36.6,38.9

* */