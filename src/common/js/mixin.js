import {mapGetters, mapMutations, mapActions} from 'vuex'
import {playModel} from 'common/js/config'
import {shuffle} from 'common/js/util'

export const playlistMixin = {
  computed: {
    ...mapGetters([
      'playList'
    ])
  },
  mounted () {
    this.handlePlaylist(this.playList)
  },
  activated () {
    this.handlePlaylist(this.playList)
  },
  watch: {
    playList (nexVal) {
      this.handlePlaylist(nexVal)
    }
  },
  methods: {
    handlePlaylist () {
      throw new Error('component must implement handlePlaylist')
    }
  }
}

export const playerMixin = {
  computed: {
    iconMode () {
      return this.mode === playModel.sequence ? 'icon-sequence' : this.mode === playModel.loop ? 'icon-loop' : 'icon-random'
    },
    ...mapGetters([
      'sequenceList',
      'currentSong',
      'playList',
      'mode',
      'favoriteList'
    ])
  },
  methods: {
    changeMode () {
      const mode = (this.mode + 1) % 3
      this.setPlayMode(mode)
      let list = null
      if (mode === playModel.random) {
        list = shuffle(this.sequenceList)
      } else {
        list = this.sequenceList
      }
      this.restCurrentIndex(list)
      this.setPlayList(list)
    },
    restCurrentIndex (list) {
      let index = list.findIndex((item) => {
        return item.id === this.currentSong.id
      })
      this.setCurrentIndex(index)
    },
    iconFavorite (song) {
      if (this.isFavorite(song)) {
        return `icon-favorite`
      } else {
        return `icon-not-favorite`
      }
    },
    favorite (song) {
      if (this.isFavorite(song)) {
        this.deleteFavoriteList(song)
      } else {
        this.saveFavoriteList(song)
      }
    },
    isFavorite (song) {
      const index = this.favoriteList.findIndex((item) => {
        return song.id === item.id
      })
      return index > -1
    },
    randomPlay () {
      this.randonPlayMode({
        list: this.songs
      })
    },
    ...mapMutations({
      setCurrentIndex: 'SET_CURRENT_INDEX',
      setPlayMode: 'SET_PLAY_MODE',
      setPlayList: 'SET_PLAYLIST',
      setPlayingState: 'SET_PLAYING_STATE'
    }),
    ...mapActions([
      'saveFavoriteList',
      'deleteFavoriteList',
      'randonPlayMode'
    ])
  }
}

export const searchMixin = {
  data () {
    return {
      query: '',
      refreshDelay: 110
    }
  },
  computed: {
    ...mapGetters([
      'searchHistory'
    ])
  },
  methods: {
    blurIn () {
      this.$refs.searchBox.blur()
    },
    searchlist () {
      this.saveSearchHistory(this.query)
    },
    onQuery (query) {
      this.query = query
    },
    addquery (query) {
      this.$refs.searchBox.setquery(query)
    },
    ...mapActions([
      'saveSearchHistory',
      'deleteSearchHistory',
      'clearSearchHistory'
    ])
  }
}
