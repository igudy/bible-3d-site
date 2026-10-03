// All site copy lives here. Scripture is quoted from the King James Version (public domain).

export const read = (q) => `https://www.biblegateway.com/passage/?search=${encodeURIComponent(q)}&version=KJV`

export const heroStats = {
  left: [['66', 'Books'], ['1,189', 'Chapters'], ['31,102', 'Verses']],
  right: [['~40', 'Authors'], ['3', 'Languages', 'Hebrew · Aramaic · Greek'], ['~1,500', 'Years in the writing']],
}

// The three acts. world: background · relic: 3D object at the centre of the stage
// (bible | tablets | fish | seal). Drop a model in public/models and map it in src/three/Relics.jsx.
export const acts = [
  {
    id: 'before', world: 'sand', stage: 'right', side: 'left', relic: 'tablets', numeral: 'I',
    label: 'Act I · Before Jesus', title: ['The', 'Promise.'], cat: 'Old Testament · 39 books · Genesis to Malachi',
    body: 'Creation and the fall, a flood and a covenant. A family chosen in Abraham, a nation freed from Egypt and given the Law at Sinai. Judges, kings and prophets, exile and return, all pointing forward to One who was promised.',
    moments: [['Creation', 'Genesis 1'], ['The Law', 'Exodus 20'], ['The Prophets', 'Isaiah 53']],
    verse: { text: 'In the beginning God created the heaven and the earth.', ref: 'Genesis 1:1' },
    mega: 'Promise', megaSize: '19vw',
  },
  {
    id: 'jesus', world: 'gold', stage: 'left', side: 'right', relic: 'fish', numeral: 'II',
    label: 'Act II · Jesus', title: ['The', 'Fulfilment.'], cat: 'The Gospels · Matthew, Mark, Luke, John',
    body: 'Four accounts of one life: born in Bethlehem, raised in Nazareth, baptised in the Jordan. He taught, healed and called twelve to follow Him, then was crucified, buried, and rose again on the third day.',
    moments: [['Birth', 'Luke 2'], ['The Cross', 'John 19'], ['The Tomb', 'Matthew 28']],
    verse: { text: 'Think not that I am come to destroy the law, or the prophets: I am not come to destroy, but to fulfil.', ref: 'Matthew 5:17' },
    mega: 'Fulfilled', megaSize: '16vw',
  },
  {
    id: 'after', world: 'fire', stage: 'right', side: 'left', relic: 'seal', numeral: 'III',
    label: 'Act III · After Jesus', title: ['The', 'Church.'], cat: 'Acts to Revelation · 23 books',
    body: 'Tongues of fire at Pentecost, and a small band in Jerusalem becomes a movement to the ends of the earth. Letters to young churches, and a final vision of all things made new.',
    moments: [['Pentecost', 'Acts 2'], ['The Letters', 'Romans – Jude'], ['All things new', 'Revelation 21']],
    verse: { text: 'And they were all filled with the Holy Ghost, and began to speak with other tongues.', ref: 'Acts 2:4' },
    mega: 'Sent', megaSize: '28vw',
  },
]

// Act II: the camera circles the statue while these lines appear, one per quarter turn.
export const statueBeats = [
  { kicker: 'The Incarnation', text: 'And the Word was made flesh, and dwelt among us.', ref: 'John 1:14', side: 'left' },
  { kicker: 'The Ministry', text: 'Healing all manner of sickness and all manner of disease among the people.', ref: 'Matthew 4:23', side: 'right' },
  { kicker: 'The Cross', text: 'It is finished: and he bowed his head, and gave up the ghost.', ref: 'John 19:30', side: 'left' },
  { kicker: 'The Resurrection', text: 'He is not here: for he is risen, as he said.', ref: 'Matthew 28:6', side: 'right' },
]

export const church = 'https://www.google.com/maps/search/church+near+me'

// The Birth — the nativity, set just before the Cross.
export const birthBeats = [
  { kicker: 'The Promise', text: 'Behold, a virgin shall conceive, and bear a son, and shall call his name Emmanuel.', ref: 'Isaiah 7:14', side: 'left' },
  { kicker: 'The Child', text: 'For unto us a child is born, unto us a son is given.', ref: 'Isaiah 9:6', side: 'right' },
  { kicker: 'The Manger', text: 'And she brought forth her firstborn son, and laid him in a manger.', ref: 'Luke 2:7', side: 'left' },
  { kicker: 'The Saviour', text: 'For unto you is born this day in the city of David a Saviour, which is Christ the Lord.', ref: 'Luke 2:11', side: 'right' },
]

// The Resurrection — no model yet; the word itself splits open like the stone.
export const risenBeats = [
  { kicker: 'The Stone', text: 'He is not here: for he is risen, as he said. Come, see the place where the Lord lay.', ref: 'Matthew 28:6', side: 'left' },
  { kicker: 'The Question', text: 'Why seek ye the living among the dead?', ref: 'Luke 24:5', side: 'right' },
  { kicker: 'The Life', text: 'I am the resurrection, and the life: he that believeth in me, though he were dead, yet shall he live.', ref: 'John 11:25', side: 'left' },
  { kicker: 'The Victory', text: 'O death, where is thy sting? O grave, where is thy victory?', ref: '1 Corinthians 15:55', side: 'right' },
]

// The closing — an invitation, with the word either side of Him.
export const invitation = {
  eyebrow: 'The invitation',
  title: ['Come to', 'Jesus.'],
  lead: 'Accept Him as your Lord and personal Saviour. The whole story — every promise, every prophet, the cross and the empty tomb — has been walking toward this moment, and toward you.',
  left: [
    { text: 'Come unto me, all ye that labour and are heavy laden, and I will give you rest.', ref: 'Matthew 11:28' },
    { text: 'Him that cometh to me I will in no wise cast out.', ref: 'John 6:37' },
  ],
  right: [
    { text: 'If thou shalt confess with thy mouth the Lord Jesus, and shalt believe in thine heart, thou shalt be saved.', ref: 'Romans 10:9' },
    { text: 'Behold, I stand at the door, and knock: if any man hear my voice, and open the door, I will come in to him.', ref: 'Revelation 3:20' },
  ],
  prayer: 'Lord Jesus, I believe You died for me and rose again. Forgive my sin. I give You my life. Be my Saviour and my Lord. Amen.',
}

// The closing: the nativity, and the invitation it opens — come, believe, and go.
export const missionBeats = [
  { kicker: 'The Invitation', text: 'Come unto me, all ye that labour and are heavy laden, and I will give you rest.', ref: 'Matthew 11:28', side: 'left' },
  { kicker: 'The Gift', text: 'For God so loved the world, that he gave his only begotten Son.', ref: 'John 3:16', side: 'right' },
  { kicker: 'The Door', text: 'Behold, I stand at the door, and knock: if any man hear my voice, and open the door, I will come in to him.', ref: 'Revelation 3:20', side: 'left' },
  { kicker: 'The Commission', text: 'Go ye into all the world, and preach the gospel to every creature.', ref: 'Mark 16:15', side: 'right' },
]

// Kept for reference — the earlier closing used the statue again.
export const foreverBeats = [
  { kicker: 'The Resurrection', text: 'He is not here: for he is risen, as he said.', ref: 'Matthew 28:6', side: 'left' },
  { kicker: 'The Promise', text: 'Lo, I am with you alway, even unto the end of the world.', ref: 'Matthew 28:20', side: 'right' },
  { kicker: 'The First and the Last', text: 'I am Alpha and Omega, the beginning and the ending, saith the Lord.', ref: 'Revelation 1:8', side: 'left' },
  { kicker: 'For ever', text: 'The grass withereth, the flower fadeth: but the word of our God shall stand for ever.', ref: 'Isaiah 40:8', side: 'right' },
]

// The Cross: two held views. The group faces you (the death), then turns to its back (the burial).
// Text sits either side of the figures; `left`/`right` are the two columns.
export const crossBeats = [
  {
    id: 'death', kicker: 'The Death', title: 'Golgotha',
    left:  { text: 'But he was wounded for our transgressions, he was bruised for our iniquities.', ref: 'Isaiah 53:5' },
    right: { text: 'Father, forgive them; for they know not what they do.', ref: 'Luke 23:34' },
    foot: 'Now from the sixth hour there was darkness over all the land unto the ninth hour.',
    footRef: 'Matthew 27:45',
  },
  {
    id: 'burial', kicker: 'The Burial', title: 'The Tomb',
    left:  { text: 'And laid it in his own new tomb, which he had hewn out in the rock.', ref: 'Matthew 27:60' },
    right: { text: 'And they that stood by beheld where he was laid.', ref: 'Mark 15:47' },
    foot: 'And he rolled a great stone to the door of the sepulchre, and departed.',
    footRef: 'Matthew 27:60',
  },
]

// The cinematic stack. Add `image: '/media/david.jpg'` or `youtube: '<video id>'` to any character
// and it becomes that panel's background. Until then each panel uses its own generated artwork.
export const characters = [
  { id: 'noah', name: 'Noah', role: 'Builder of the ark', era: 'Genesis 6–9', passage: 'Genesis 6-9', palette: ['#0d1a2b', '#3b5b78', '#c9d8e6'], symbol: 'ark',
    body: 'In a world filled with violence, one man walked with God. He built an ark at God’s word, carried life through the flood, and saw the first rainbow of promise.',
    verse: ['But Noah found grace in the eyes of the LORD.', 'Genesis 6:8'] },
  { id: 'abraham', name: 'Abraham', role: 'Father of many nations', era: 'Genesis 12–25', passage: 'Genesis 12', palette: ['#120c05', '#6b4a1e', '#f0d9a8'], symbol: 'stars',
    body: 'Called out of Ur with nothing but a promise, he left everything he knew. God told him to count the stars: so shall thy seed be.',
    verse: ['And he believed in the LORD; and he counted it to him for righteousness.', 'Genesis 15:6'] },
  { id: 'moses', name: 'Moses', role: 'Deliverer and lawgiver', era: 'Exodus – Deuteronomy', passage: 'Exodus 14', palette: ['#1a0f08', '#8a4b1f', '#f4c48a'], symbol: 'sea',
    body: 'Drawn from the Nile, called from a burning bush. He stood before Pharaoh, led Israel through the parted sea, and carried the Law down from Sinai.',
    verse: ['Fear ye not, stand still, and see the salvation of the LORD, which he will shew to you to day.', 'Exodus 14:13'] },
  { id: 'ruth', name: 'Ruth', role: 'Loyal to the end', era: 'Ruth 1–4', passage: 'Ruth 1', palette: ['#16120a', '#8c7a3a', '#efe2b0'], symbol: 'wheat',
    body: 'A Moabite widow who refused to leave her mother-in-law. Gleaning in the fields of Boaz, she became the great-grandmother of King David.',
    verse: ['Thy people shall be my people, and thy God my God.', 'Ruth 1:16'] },
  { id: 'david', name: 'David', role: 'Shepherd, giant-slayer, king', era: '1 Samuel 16 – 1 Kings 2', passage: '1 Samuel 17', palette: ['#0b0a1c', '#4b3a8c', '#e6d38a'], symbol: 'crown',
    body: 'The youngest son, keeping sheep, anointed king. He faced Goliath with a sling and five stones, wrote psalms that still lead worship, and was called a man after God’s own heart.',
    verse: ['The LORD is my shepherd; I shall not want.', 'Psalm 23:1'] },
  { id: 'esther', name: 'Esther', role: 'Queen for such a time', era: 'Esther 1–10', passage: 'Esther 4', palette: ['#1a0610', '#7a1a44', '#f2c6d6'], symbol: 'sceptre',
    body: 'An orphan raised by her cousin, made queen of Persia. When her people faced destruction she risked her life and went in to the king unsummoned.',
    verse: ['Who knoweth whether thou art come to the kingdom for such a time as this?', 'Esther 4:14'] },
  { id: 'elijah', name: 'Elijah', role: 'Prophet of fire', era: '1 Kings 17 – 2 Kings 2', passage: '1 Kings 18', palette: ['#170500', '#9a2a00', '#ffb36a'], symbol: 'flame',
    body: 'He called down fire on Mount Carmel before the prophets of Baal, heard God in a still small voice, and was taken up by a whirlwind in a chariot of fire.',
    verse: ['The LORD, he is the God; the LORD, he is the God.', '1 Kings 18:39'] },
  { id: 'daniel', name: 'Daniel', role: 'Faithful in Babylon', era: 'Daniel 1–12', passage: 'Daniel 6', palette: ['#0a0f0c', '#3d5a45', '#d8e6c6'], symbol: 'lion',
    body: 'Carried into exile as a youth, he served kings yet would not bow. He prayed three times a day with his windows open, and God shut the lions’ mouths.',
    verse: ['My God hath sent his angel, and hath shut the lions’ mouths.', 'Daniel 6:22'] },
  { id: 'mary', name: 'Mary', role: 'Mother of Jesus', era: 'Luke 1–2', passage: 'Luke 1', palette: ['#06101f', '#24508a', '#d6e4f7'], symbol: 'star',
    body: 'A young woman in Nazareth, visited by the angel Gabriel. Her yes made room for the Saviour, and she treasured all these things in her heart.',
    verse: ['Behold the handmaid of the Lord; be it unto me according to thy word.', 'Luke 1:38'] },
  { id: 'paul', name: 'Paul', role: 'Apostle to the nations', era: 'Acts 9 – 2 Timothy', passage: 'Acts 9', palette: ['#0f0c0a', '#5a4636', '#ead8c2'], symbol: 'scroll',
    body: 'A persecutor blinded by light on the Damascus road. He became the church’s great missionary, planting churches across the empire and writing thirteen letters of the New Testament.',
    verse: ['I have fought a good fight, I have finished my course, I have kept the faith.', '2 Timothy 4:7'] },
]

// The Twelve (Matthew 10:2–4), with Matthias who replaced Judas (Acts 1:26).
export const disciples = [
  { name: 'Simon Peter', tag: 'The Rock', note: 'A fisherman who walked on water, denied Jesus three times, was restored, and preached at Pentecost.', ref: 'Matthew 16:18' },
  { name: 'Andrew', tag: 'First called', note: 'Peter’s brother. He brought Peter to Jesus, and later the boy with five loaves and two fishes.', ref: 'John 1:40-42' },
  { name: 'James', tag: 'Son of thunder', note: 'Son of Zebedee, fisherman, and the first of the Twelve to be martyred.', ref: 'Acts 12:2' },
  { name: 'John', tag: 'The beloved', note: 'James’s brother, “the disciple whom Jesus loved”; he wrote the Fourth Gospel and three letters.', ref: 'John 13:23' },
  { name: 'Philip', tag: 'Come and see', note: 'From Bethsaida. He found Nathanael and asked, “Lord, shew us the Father.”', ref: 'John 14:8' },
  { name: 'Bartholomew', tag: 'Without guile', note: 'Usually identified with Nathanael: “an Israelite indeed, in whom is no guile.”', ref: 'John 1:47' },
  { name: 'Thomas', tag: 'My Lord and my God', note: 'He doubted until he saw, then gave one of the Gospels’ highest confessions of faith.', ref: 'John 20:28' },
  { name: 'Matthew', tag: 'The tax collector', note: 'Called from the receipt of custom; he wrote the Gospel that bears his name.', ref: 'Matthew 9:9' },
  { name: 'James', tag: 'Son of Alphaeus', note: 'Often called James the Less, one of the quiet faithful of the Twelve.', ref: 'Mark 3:18' },
  { name: 'Thaddaeus', tag: 'Judas, not Iscariot', note: 'Also called Jude; at the Last Supper he asked how Jesus would show Himself to them.', ref: 'John 14:22' },
  { name: 'Simon', tag: 'The Zealot', note: 'Once a zealot, he followed Jesus alongside Matthew the tax collector.', ref: 'Luke 6:15' },
  { name: 'Judas Iscariot', tag: 'The betrayer', note: 'He betrayed Jesus for thirty pieces of silver; Matthias was later chosen in his place.', ref: 'Matthew 26:15' },
]

// The 66 books, by section, with chapter counts
export const library = [
  { testament: 'Old', group: 'Law', books: [['Genesis', 50], ['Exodus', 40], ['Leviticus', 27], ['Numbers', 36], ['Deuteronomy', 34]] },
  { testament: 'Old', group: 'History', books: [['Joshua', 24], ['Judges', 21], ['Ruth', 4], ['1 Samuel', 31], ['2 Samuel', 24], ['1 Kings', 22], ['2 Kings', 25], ['1 Chronicles', 29], ['2 Chronicles', 36], ['Ezra', 10], ['Nehemiah', 13], ['Esther', 10]] },
  { testament: 'Old', group: 'Poetry & Wisdom', books: [['Job', 42], ['Psalms', 150], ['Proverbs', 31], ['Ecclesiastes', 12], ['Song of Solomon', 8]] },
  { testament: 'Old', group: 'Major Prophets', books: [['Isaiah', 66], ['Jeremiah', 52], ['Lamentations', 5], ['Ezekiel', 48], ['Daniel', 12]] },
  { testament: 'Old', group: 'Minor Prophets', books: [['Hosea', 14], ['Joel', 3], ['Amos', 9], ['Obadiah', 1], ['Jonah', 4], ['Micah', 7], ['Nahum', 3], ['Habakkuk', 3], ['Zephaniah', 3], ['Haggai', 2], ['Zechariah', 14], ['Malachi', 4]] },
  { testament: 'New', group: 'Gospels', books: [['Matthew', 28], ['Mark', 16], ['Luke', 24], ['John', 21]] },
  { testament: 'New', group: 'History', books: [['Acts', 28]] },
  { testament: 'New', group: 'Paul’s Letters', books: [['Romans', 16], ['1 Corinthians', 16], ['2 Corinthians', 13], ['Galatians', 6], ['Ephesians', 6], ['Philippians', 4], ['Colossians', 4], ['1 Thessalonians', 5], ['2 Thessalonians', 3], ['1 Timothy', 6], ['2 Timothy', 4], ['Titus', 3], ['Philemon', 1]] },
  { testament: 'New', group: 'General Letters', books: [['Hebrews', 13], ['James', 5], ['1 Peter', 5], ['2 Peter', 3], ['1 John', 5], ['2 John', 1], ['3 John', 1], ['Jude', 1]] },
  { testament: 'New', group: 'Prophecy', books: [['Revelation', 22]] },
]

export const railItems = [
  // ['top', 'The Bible'], ['before', 'Before Jesus'], ['after', 'After Jesus'],   (parked)
  ['jesus', 'Emmanuel'],
  ['birth', 'The Birth'], ['cross', 'The Cross'], ['risen', 'Risen'],
  ['characters', 'Characters'], ['disciples', 'The Twelve'], ['books', 'The Books'], ['forever', 'Come to Jesus'],
]

export const credits = [
  'Nativity of Jesus Scene: “Nativity of Jesus Scene” by SPAWNPAWS, CC-BY-4.0 (sketchfab.com/3d-models/nativity-of-jesus-scene-b84cf44360ac448ca51d016f8cff6992)',
  'Kreuzigungsgruppe: “Kreuzigungsgruppe” by noe-3d.at, CC-BY-NC-4.0 — non-commercial use only (sketchfab.com/3d-models/kreuzigungsgruppe-0fc54805b2544b1c9d2809439d85d971)',
  'Jesus Christ Statue: “Jesus Christ Statue” by amcgi, CC-BY-4.0 (sketchfab.com/3d-models/jesus-christ-statue-375d626ccd524c439e9dc81c1033828e)',
  'Seal of the Nazarene church: “seal, or ancient symbol of the Nazarene church” by Victor.Alfonso.Ibarra.Ortega, CC-BY-4.0 (sketchfab.com)',
  'Holy Bible model: via Sketchfab (add author credit)',
]
