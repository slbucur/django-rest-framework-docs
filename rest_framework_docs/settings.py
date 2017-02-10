from django.conf import settings


class DRFSettings(object):

    def __init__(self):
        self.drf_settings = {
            "HIDE_DOCS": self.get_setting("HIDE_DOCS") or False,
            "IGNORE_URL_REGEX": self.get_setting("IGNORE_SUB_FIELDS") or None,
            "INCLUDE_ONLY_URLS": self.get_setting("INCLUDE_ONLY_URLS") or None,
            "ALLOWED_URL_NAMES": self.get_setting("ALLOWED_URL_NAMES") or None,
        }

    def get_setting(self, name):
        try:
            return settings.REST_FRAMEWORK_DOCS[name]
        except:
            return None

    @property
    def settings(self):
        return self.drf_settings
