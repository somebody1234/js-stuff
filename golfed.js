f=hcf=a=>b=>b?f(b)(a%b):a
fsimp=m=>n=>[m,n].map(_=>_/f(m)(n))
ffsimp=m=>n=>[m,n].map((c=>_=>_/c)(f(m)(n)))