import { TaroApi } from '@hodlone/taro-api';
import { TaroNode } from 'shared/types';
import { read } from 'utils/files';

class TaroService {
  private taroApi: TaroApi;
  createClient(node: TaroNode) {
    return TaroApi.create({
      socket: `127.0.0.1:${node.ports.rpc}`,
      macaroon: read(node.paths.macaroon, 'hex'),
      cert: read(node.paths.tlsCert, 'hex'),
    });
  }

  constructor() {
    this.taroApi = new TaroApi();
  }

  public async getTaro(node: TaroNode) {
    return this.createClient(node).getInfo();
  }
}

const taro = TaroApi.create({
  socket: '127.0.0.1:10029',
  macaroon:
    '0201047461726f026f030a100177ae3a6fe2a57c46a6d51d5ca9ebd71201301a180a09616464726573736573120472656164120577726974651a150a06617373657473120472656164120577726974651a0f0a066461656d6f6e120577726974651a150a0670726f6f667312047265616412057772697465000006201e3dbeba0be88d83c928e86811eaf306d823d458bee66c98af024e8a8a71b455',
  cert: '2d2d2d2d2d424547494e2043455254494649434154452d2d2d2d2d0a4d4949436d7a4343416b47674177494241674952414e4254326855763244454f4b544d725162444466355577436759494b6f5a497a6a3045417749774e6a45670a4d4234474131554543684d586447467962794268645852765a3256755a584a686447566b49474e6c636e5178456a415142674e5642414d5443584a6a617931300a6233646c636a4165467730794d6a45774d6a45774e7a557a4d544661467730794d7a45794d5459774e7a557a4d5446614d4459784944416542674e5642416f540a46335268636d3867595856306232646c626d56795958526c5a43426a5a584a304d524977454159445651514445776c7959327374644739335a584977575441540a42676371686b6a4f5051494242676771686b6a4f50514d4242774e43414152616758682f446a647876324643666b377934497269775039492f466862326463410a5a55393961645247364e4350776138346943495069634264466a4946676d47446a676e366764536965487353514a77514667704c6f3449424c6a434341536f770a44675944565230504151482f4241514441674b6b4d424d47413155644a51514d4d416f47434373474151554642774d424d41384741315564457745422f7751460a4d414d4241663877485159445652304f42425945464b377734526530506e6d6c5468526f5239377a52636f46444946664d49485342674e564852454567636f770a6763654343584a6a617931306233646c636f494a6247396a5957786f62334e3067675231626d6c3467677031626d6c346347466a613256306767646964575a6a0a623235756877522f414141426878414141414141414141414141414141414141414141426877544171414757687753734551414268775373456741426878442b0a674141414141414141456e39686555432f68396a6878442b67414141414141414141424368662f2b707859496878442b67414141414141414149684352502f2b0a4c4330426878442b67414141414141414146776562502f2b517576656878442b6741414141414141414a53554a662f2b36756c6b6878442b67414141414141410a41476a624a662f2b57484f6b4d416f4743437147534d343942414d43413067414d4555434951432f6146634f6b355a2f3236472f486b776461436146357777630a65374a63413834724737317a4174346e6a6749674d4d30643061786e796e4748584c5a624347596c72747756476163457863696a32785330743377502f4a553d0a2d2d2d2d2d454e442043455254494649434154452d2d2d2d2d0a',
});
