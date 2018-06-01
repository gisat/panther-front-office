define(['worldwind'], function(){
    var cache = new WorldWind.MemoryCache(1000000, 800000);

    return cache;
});