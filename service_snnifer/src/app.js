const express = require("express");
const cors = require("cors");
const axios = require('axios');

const app = express();

app.use(express.json());
app.use(cors());

const routes = express.Router();

// routes.post("/qrcode/novo", controller.cadastrar);

msgteste = {
    _data: {
        id: {
            fromMe: false,
            remote: '5511949497844@c.us',
            id: '7EE9467183152B1A39D0F05905BC0399',
            _serialized: 'false_5511949497844@c.us_7EE9467183152B1A39D0F05905BC0399'
        },
        viewed: false,
        body: 'Olá Jorge, meu nome é Luis e eu gostaria de ter vender esse super carro que está em promoção, por apenas 20mil reais. Segue minha chave Pix 11949497844! \n' +
            '\n' +
            '🍄\n' +
            '\n' +
            'É um prazer com você.',
        type: 'chat',
        t: 1718322751,
        notifyName: '~lfelipe_sj📍',
        from: '5511949497844@c.us',
        to: '5511932249563@c.us',
        ack: 1,
        invis: false,
        isNewMsg: true,
        star: false,
        kicNotified: false,
        recvFresh: true,
        isFromTemplate: false,
        pollInvalidated: false,
        isSentCagPollCreation: false,
        latestEditMsgKey: null,
        latestEditSenderTimestampMs: null,
        mentionedJidList: [],
        groupMentions: [],
        isEventCanceled: false,
        eventInvalidated: false,
        isVcardOverMmsDocument: false,
        isForwarded: false,
        hasReaction: false,
        productHeaderImageRejected: false,
        lastPlaybackProgress: 0,
        isDynamicReplyButtonsMsg: false,
        isCarouselCard: false,
        parentMsgId: null,
        isMdHistoryMsg: false,
        stickerSentTs: 0,
        isAvatar: false,
        lastUpdateFromServerTs: 0,
        invokedBotWid: null,
        bizBotType: null,
        botResponseTargetId: null,
        botPluginType: null,
        botPluginReferenceIndex: null,
        botPluginSearchProvider: null,
        botPluginSearchUrl: null,
        botPluginMaybeParent: false,
        botReelPluginThumbnailCdnUrl: null,
        botMsgBodyType: null,
        requiresDirectConnection: null,
        bizContentPlaceholderType: null,
        hostedBizEncStateMismatch: false,
        senderOrRecipientAccountTypeHosted: false,
        placeholderCreatedWhenAccountIsHosted: false,
        links: []
    },
    mediaKey: undefined,
    id: {
        fromMe: false,
        remote: '5511949497844@c.us',
        id: '7EE9467183152B1A39D0F05905BC0399',
        _serialized: 'false_5511949497844@c.us_7EE9467183152B1A39D0F05905BC0399'
    },
    ack: 1,
    hasMedia: false,
    body: 'Olá Jorge, meu nome é Luis e eu gostaria de ter vender esse super carro que está em promoção, por apenas 20mil reais. Segue minha chave Pix 11949497844! \n' +
        '\n' +
        '🍄\n' +
        '\n' +
        'É um prazer com você.',
    type: 'chat',
    timestamp: 1718322751,
    from: '5511949497844@c.us',
    to: '5511932249563@c.us',
    author: undefined,
    deviceType: 'android',
    isForwarded: false,
    forwardingScore: 0,
    isStatus: false,
    isStarred: false,
    broadcast: undefined,
    fromMe: false,
    hasQuotedMsg: false,
    hasReaction: false,
    duration: undefined,
    location: undefined,
    vCards: [],
    inviteV4: undefined,
    mentionedIds: [],
    orderId: undefined,
    token: undefined,
    isGif: false,
    isEphemeral: undefined,
    links: []
}



module.exports = app;