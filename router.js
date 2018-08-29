const Router = require('koa-router');
const api = require('./api');

let router = new Router();

async function getCommonData() {
    let individuation = await api.getIndividuationData();
    let nickname = individuation.nickname || '';
    let self_intro = individuation.self_intro || '';
    let portrait = individuation.portrait || '';
    let articleTotal = await api.getArticleTotal();
    let labelTotal = await api.getLabelTotal();
    let banner = await api.getBannerData();
    let businessCard = {nickname, self_intro, portrait, articleTotal, labelTotal};
    let sideBar = {businessCard, banner};
    return {individuation, sideBar};
}

router
    .get('/', async ctx => {
        let commonData = await getCommonData();
        let pageIndex = ctx.query.pageIndex;
        let labelId = ctx.query.labelId;
        let searchVal = ctx.query.searchVal;
        let labelName = '';
        let articleList = {};
        if (searchVal) {
            articleList = await api.getArticleList({searchVal, pageIndex});
        } else if (labelId) {
            articleList = await api.getArticleListByLabelId({labelId, pageIndex});
            labelName = await api.getLabelNameById({id: labelId});
        } else {
            articleList = await api.getArticleList({pageIndex});
        }
        await ctx.render('./pages/index', {
            individuation: commonData.individuation,
            banner: commonData.sideBar.banner,
            sideBar: commonData.sideBar,
            searchVal,
            labelName,
            articleList
        });
    })
    .get('/archive', async ctx => {
        let commonData = await getCommonData();
        let pageIndex = ctx.query.pageIndex;
        let pageSize = 12;
        let archiveList = await api.getArticleArchive({pageIndex, pageSize});
        await ctx.render('./pages/archive', {
            individuation: commonData.individuation,
            sideBar: commonData.sideBar,
            archiveList
        });
    })
    .get('/label', async ctx => {
        let commonData = await getCommonData();
        let labelList = await api.getLabelList();
        await ctx.render('./pages/label', {
            individuation: commonData.individuation,
            sideBar: commonData.sideBar,
            labelList
        });
    });

module.exports = router;