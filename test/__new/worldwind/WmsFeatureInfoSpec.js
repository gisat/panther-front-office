define([
    'src/__new/js/worldwind/WmsFeatureInfo'
], function (WmsFeatureInfo) {
    "use strict";

    describe('WMSFeatureInfoSpec#Retrieve details', function () {
        describe('When the valid parameters are passed', function () {
            it('then returns valid HTML', function(done){
                new WmsFeatureInfo({
                    serviceAddress: 'https://services.sentinel-hub.com/v1/wms/2b4b07d4-ef84-4c6a-aefd-c6a76d250760',
                    layers: 'RGB_8_11_4',
                    position: {
                        latitude: 113.203125,
                        longitude: -7.20703125
                    },
                    customParameters: {
                        time: '2017-06-11',
                        showLogo: false
                    }
                }).html().then(function(result){
                    expect(result).toBe('\n' +
                        '\n' +
                        '\n' +
                        '<table>\n' +
                        '</table><table border="1" style="width:100%">\n' +
                        '<tbody><tr>\n' +
                        '<th>id</th>\n' +
                        '<th>date</th>\n' +
                        '<th>time</th>\n' +
                        '<th>path</th>\n' +
                        '<th>source</th>\n' +
                        '<th>crs</th>\n' +
                        '<th>mbr</th>\n' +
                        '<th>cloudCoverPercentage</th>\n' +
                        '<th>B08</th>\n' +
                        '<th>B11</th>\n' +
                        '<th>B04</th>\n' +
                        '</tr>\n' +
                        '<tr>\n' +
                        '<td>49MGN</td>\n' +
                        '<td>2017-05-26</td>\n' +
                        '<td>02:45:03</td>\n' +
                        '<td><a href="http://sentinel-s2-l1c.s3-website.eu-central-1.amazonaws.com/#tiles/49/M/GN/2017/5/26/0/">http://sentinel-s2-l1c.s3-website.eu-central-1.amazonaws.com/#tiles/49/M/GN/2017/5/26/0/</a></td>\n' +
                        '<td>MSI/L1C/2017/05/26/S2A_MSIL1C_20170526T022551_N0205_R046_T49MGN_20170526T024503.SAFE/GRANULE/L1C_T49MGN_A010053_20170526T024503/IMG_DATA/T49MGN_20170526T022551_</td>\n' +
                        '<td>EPSG:32749</td>\n' +
                        '<td>699960,9190240 809760,9300040</td>\n' +
                        '<td>28.96</td>\n' +
                        '<td>0.2379000038</td>\n' +
                        '<td>0.1799000055</td>\n' +
                        '<td>0.0666999966</td>\n' +
                        '</tr>\n' +
                        '</tbody></table>\n' +
                        '\n' +
                        '\n');

                    done();
                }).catch(function(err) {
                    done(err);
                });
            })
        });
    });
});