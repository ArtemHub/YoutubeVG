<?php
if(!class_exists('YoutubeVGInputRender')) {

    class YoutubeVGInputRender extends modTemplateVarInputRender {
        public function getTemplate() {
            return $this->modx->getOption('core_path').'components/youtubevg/tv/input/tpl/youtubevg.tv.tpl';
        }
        public function process($value,array $params = array()) {
            $this->modx->regClientStartupScript($this->modx->getOption('assets_url').'components/youtubevg/js/mgr/youtubevg.tv.js');
        }
    }
}
return 'YoutubeVGInputRender';